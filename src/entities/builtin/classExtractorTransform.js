export class ClassNode {
	name
	children = []
	inherets
	relations = []
	properties = []
	constructor(name) {
		this.name = name
	}
	relationIds = []
}

function parseType(ast, prop, nullable) {
	let type = prop.type
	let ret = { propName: prop.name.escapedText, typeName: '', isArray: false, options: [], nullable }
	try {
		parseTypeRec(type, ast, 0, ret)
	}
	catch (e) {
		throw new Error('Error in parse function')
	}
	if (ret.typeName == '') {
		throw new Error(`Could not parse type ${type.getFullText().trim()} on property`)
	}
	return ret
}

function parseTypeRec(type, ast, i, ret) {
	if (type.typeName && !type.typeArguments) {
		ret.typeName = type.typeName.escapedText
	}
	if (type.elementType) {
		ret.isArray = true
		parseTypeRec(type.elementType, ast, i + 1, ret)
	}
	if (!type.elementType && !type.typeName) {
		let token = ast.text.substring(type.pos, type.end).trim()
		ret.typeName = token
	}
	if (type.typeArguments) {
		ret.options.push(type.typeName.escapedText)
		parseTypeRec(type.typeArguments[0], ast, i + 1, ret)
	}
}

function findAndAdd(cur, nodes) {
	const EntityList = Object.fromEntries(Object.entries(Entities))
	let proto = EntityList[Object.getPrototypeOf(EntityList[cur.name]).name]
	if (proto) {
		let superClass = nodes.find(node => node.name == proto.name)
		findAndAdd(superClass, nodes)
		cur.inherets = superClass
	}
	cur.relations.forEach((relation) => {
		if (relation[0].options.includes('Owns')) {
			let next = nodes.find(node => node.name == relation[0].typeName)
			findAndAdd(next, nodes)
			cur.children.push(next)
		}
	})
}

function sortNodes(rootName, nodes) {
	let root = nodes.find(node => node.name == rootName)
	findAndAdd(root, nodes)
	return root
}

function flattenInheritance(node) {
	let properties = []
	let relations = []
	let relationIds = []
	properties.push(...node.properties)
	relations.push(...node.relations)
	relationIds.push(...node.relationIds)
	if (node.inherets) {
		let inherets = node.inherets
		while (inherets) {
			properties.push(...inherets.properties)
			relations.push(...inherets.relations)
			relationIds.push(...inherets.relationIds)
			inherets = inherets.inherets
		}
		properties.concat(node.inherets.properties)
	}
	return { properties, relations, relationIds }
}
export default function (program) {
	const checker = program.getTypeChecker()
	return (context) => {
		let classes = []
		return (sourceFile) => {
			console.log(sourceFile.fileName)
			const visitor = (node) => {
				if (ts.isClassDeclaration(node)) {
					let name = node.name.getText(sourceFile)
					let heritage = []
					let members = []
					node.heritageClauses?.forEach(val => {
						val.types.forEach(type => {
							heritage.push(type.expression.getText(sourceFile))
						})
					})
					node.members?.forEach(member => {
						if (ts.isPropertyDeclaration(member)) {
							let nullable = false
							if (member.questionToken) {
								nullable = true
							}
							try {
								members.push(parseType(sourceFile, member, nullable))
							}
							catch (e) {
							}
						}
					})
					classes.push({
						name,
						heritage,
						members
					})
					console.log({
						name,
						heritage,
						members
					})
				}
				return ts.visitEachChild(node, visitor, context)
			}
			return ts.visitNode(sourceFile, visitor)
		}
		console.log('before analyzer')
		const isEntity = (val) => {
			if (val.heritage.includes('EntropyEntity')) {
				return true
			}
			else {
				return !val.heritage.map(superName => {
					return isEntity(classes.find(superClass => superClass.name == superName))
				}).includes(false)
			}
		}
		let entities = classes.filter(val => isEntity(val)).map(val => { return { entity: new ClassNode(val.name), members: val.members, heritage: val.heritage } })
		let classNodes = entities.map(({ entity, members, heritage }) => {
			members.forEach(member => {
				let coClass = entities.find(co => member.typeName == co.entity.name)
				if (coClass) {
					let coType = coClass.members.find(co => co.typeName == entity.name)
					entity.relations.push([member, coType])
				}
				else {
					let testEntity = entities.find(testEnt => (camelize(testEnt.entity.name) + 'Id') == member.propName) ||
						entities.find(testEnt => (camelize(testEnt.entity.name) + 'Ids') == member.propName)
					if (testEntity) {
						let relType = testEntity.members.find(rel => rel.typeName == entity.name)
						entity.relationIds.push([member, relType])
					}
					else {
						entity.properties.push(member)
					}
				}
			})
			if (heritage.length > 0) {
				entity.inherets = entities.find(superClass => superClass.entity.name == heritage[0]).entity
			}
			return entity
		})
		console.log(classNodes)
	}
}
