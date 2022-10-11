export var GET;
(function (GET) {
	let User;
	(function (User) {
		User['email'] = 'User - View Email'
		User['password'] = 'User - View Password'
		User['name'] = 'User - View Name'
		User['verified'] = 'User - View Verified'
		User['image'] = 'User - View Image'
		User['id'] = 'User - View Id'
		User['createdAt'] = 'User - View Created At'
		User['updatedAt'] = 'User - View Updated At'
	})(User = GET.User || (GET.User = {}))
	let GlobalRole;
	(function (GlobalRole) {
		GlobalRole['allows'] = 'Global Role - View Allows'
		GlobalRole['blocks'] = 'Global Role - View Blocks'
		GlobalRole['rank'] = 'Global Role - View Rank'
		GlobalRole['name'] = 'Global Role - View Name'
		GlobalRole['graphic'] = 'Global Role - View Graphic'
		GlobalRole['id'] = 'Global Role - View Id'
		GlobalRole['createdAt'] = 'Global Role - View Created At'
		GlobalRole['updatedAt'] = 'Global Role - View Updated At'
	})(GlobalRole = GET.GlobalRole || (GET.GlobalRole = {}))
	let Domain;
	(function (Domain) {
		Domain['handle'] = 'Domain - View Handle'
		Domain['everyoneScopes'] = 'Domain - View Everyone Scopes'
		Domain['anonScopes'] = 'Domain - View Anon Scopes'
		Domain['id'] = 'Domain - View Id'
		Domain['createdAt'] = 'Domain - View Created At'
		Domain['updatedAt'] = 'Domain - View Updated At'
	})(Domain = GET.Domain || (GET.Domain = {}))
	let Developer;
	(function (Developer) {
		Developer['apiKey'] = 'Developer - View Api Key'
		Developer['id'] = 'Developer - View Id'
		Developer['createdAt'] = 'Developer - View Created At'
		Developer['updatedAt'] = 'Developer - View Updated At'
	})(Developer = GET.Developer || (GET.Developer = {}))
	let DevItem;
	(function (DevItem) {
		DevItem['location'] = 'Dev Item - View Location'
		DevItem['name'] = 'Dev Item - View Name'
		DevItem['status'] = 'Dev Item - View Status'
		DevItem['config'] = 'Dev Item - View Config'
		DevItem['id'] = 'Dev Item - View Id'
		DevItem['createdAt'] = 'Dev Item - View Created At'
		DevItem['updatedAt'] = 'Dev Item - View Updated At'
	})(DevItem = GET.DevItem || (GET.DevItem = {}))
	let StoreItem;
	(function (StoreItem) {
		StoreItem['location'] = 'Store Item - View Location'
		StoreItem['name'] = 'Store Item - View Name'
		StoreItem['description'] = 'Store Item - View Description'
		StoreItem['config'] = 'Store Item - View Config'
		StoreItem['id'] = 'Store Item - View Id'
		StoreItem['createdAt'] = 'Store Item - View Created At'
		StoreItem['updatedAt'] = 'Store Item - View Updated At'
	})(StoreItem = GET.StoreItem || (GET.StoreItem = {}))
	let Channel;
	(function (Channel) {
		Channel['activeLayout'] = 'Channel - View Active Layout'
		Channel['templateLayouts'] = 'Channel - View Template Layouts'
		Channel['id'] = 'Channel - View Id'
		Channel['createdAt'] = 'Channel - View Created At'
		Channel['updatedAt'] = 'Channel - View Updated At'
	})(Channel = GET.Channel || (GET.Channel = {}))
	let Widget;
	(function (Widget) {
		Widget['config'] = 'Widget - View Config'
		Widget['id'] = 'Widget - View Id'
		Widget['createdAt'] = 'Widget - View Created At'
		Widget['updatedAt'] = 'Widget - View Updated At'
	})(Widget = GET.Widget || (GET.Widget = {}))
	let Room;
	(function (Room) {
		Room['name'] = 'Room - View Name'
		Room['readScopes'] = 'Room - View Read Scopes'
		Room['writeScopes'] = 'Room - View Write Scopes'
		Room['deleteScopes'] = 'Room - View Delete Scopes'
		Room['id'] = 'Room - View Id'
		Room['createdAt'] = 'Room - View Created At'
		Room['updatedAt'] = 'Room - View Updated At'
	})(Room = GET.Room || (GET.Room = {}))
	let Message;
	(function (Message) {
		Message['data'] = 'Message - View Data'
		Message['id'] = 'Message - View Id'
		Message['createdAt'] = 'Message - View Created At'
		Message['updatedAt'] = 'Message - View Updated At'
	})(Message = GET.Message || (GET.Message = {}))
	let DomainRole;
	(function (DomainRole) {
		DomainRole['allows'] = 'Domain Role - View Allows'
		DomainRole['blocks'] = 'Domain Role - View Blocks'
		DomainRole['rank'] = 'Domain Role - View Rank'
		DomainRole['name'] = 'Domain Role - View Name'
		DomainRole['graphic'] = 'Domain Role - View Graphic'
		DomainRole['id'] = 'Domain Role - View Id'
		DomainRole['createdAt'] = 'Domain Role - View Created At'
		DomainRole['updatedAt'] = 'Domain Role - View Updated At'
	})(DomainRole = GET.DomainRole || (GET.DomainRole = {}))
})(GET || (GET = {}))
export var PUT;
(function (PUT) {
	let User;
	(function (User) {
		User['email'] = 'User - Modify Email'
		User['password'] = 'User - Modify Password'
		User['name'] = 'User - Modify Name'
		User['verified'] = 'User - Modify Verified'
		User['image'] = 'User - Modify Image'
		User['id'] = 'User - Modify Id'
		User['createdAt'] = 'User - Modify Created At'
		User['updatedAt'] = 'User - Modify Updated At'
	})(User = PUT.User || (PUT.User = {}))
	let GlobalRole;
	(function (GlobalRole) {
		GlobalRole['allows'] = 'Global Role - Modify Allows'
		GlobalRole['blocks'] = 'Global Role - Modify Blocks'
		GlobalRole['rank'] = 'Global Role - Modify Rank'
		GlobalRole['name'] = 'Global Role - Modify Name'
		GlobalRole['graphic'] = 'Global Role - Modify Graphic'
		GlobalRole['id'] = 'Global Role - Modify Id'
		GlobalRole['createdAt'] = 'Global Role - Modify Created At'
		GlobalRole['updatedAt'] = 'Global Role - Modify Updated At'
	})(GlobalRole = PUT.GlobalRole || (PUT.GlobalRole = {}))
	let Domain;
	(function (Domain) {
		Domain['handle'] = 'Domain - Modify Handle'
		Domain['everyoneScopes'] = 'Domain - Modify Everyone Scopes'
		Domain['anonScopes'] = 'Domain - Modify Anon Scopes'
		Domain['id'] = 'Domain - Modify Id'
		Domain['createdAt'] = 'Domain - Modify Created At'
		Domain['updatedAt'] = 'Domain - Modify Updated At'
	})(Domain = PUT.Domain || (PUT.Domain = {}))
	let Developer;
	(function (Developer) {
		Developer['apiKey'] = 'Developer - Modify Api Key'
		Developer['id'] = 'Developer - Modify Id'
		Developer['createdAt'] = 'Developer - Modify Created At'
		Developer['updatedAt'] = 'Developer - Modify Updated At'
	})(Developer = PUT.Developer || (PUT.Developer = {}))
	let DevItem;
	(function (DevItem) {
		DevItem['location'] = 'Dev Item - Modify Location'
		DevItem['name'] = 'Dev Item - Modify Name'
		DevItem['status'] = 'Dev Item - Modify Status'
		DevItem['config'] = 'Dev Item - Modify Config'
		DevItem['id'] = 'Dev Item - Modify Id'
		DevItem['createdAt'] = 'Dev Item - Modify Created At'
		DevItem['updatedAt'] = 'Dev Item - Modify Updated At'
	})(DevItem = PUT.DevItem || (PUT.DevItem = {}))
	let StoreItem;
	(function (StoreItem) {
		StoreItem['location'] = 'Store Item - Modify Location'
		StoreItem['name'] = 'Store Item - Modify Name'
		StoreItem['description'] = 'Store Item - Modify Description'
		StoreItem['config'] = 'Store Item - Modify Config'
		StoreItem['id'] = 'Store Item - Modify Id'
		StoreItem['createdAt'] = 'Store Item - Modify Created At'
		StoreItem['updatedAt'] = 'Store Item - Modify Updated At'
	})(StoreItem = PUT.StoreItem || (PUT.StoreItem = {}))
	let Channel;
	(function (Channel) {
		Channel['activeLayout'] = 'Channel - Modify Active Layout'
		Channel['templateLayouts'] = 'Channel - Modify Template Layouts'
		Channel['id'] = 'Channel - Modify Id'
		Channel['createdAt'] = 'Channel - Modify Created At'
		Channel['updatedAt'] = 'Channel - Modify Updated At'
	})(Channel = PUT.Channel || (PUT.Channel = {}))
	let Widget;
	(function (Widget) {
		Widget['config'] = 'Widget - Modify Config'
		Widget['id'] = 'Widget - Modify Id'
		Widget['createdAt'] = 'Widget - Modify Created At'
		Widget['updatedAt'] = 'Widget - Modify Updated At'
	})(Widget = PUT.Widget || (PUT.Widget = {}))
	let Room;
	(function (Room) {
		Room['name'] = 'Room - Modify Name'
		Room['readScopes'] = 'Room - Modify Read Scopes'
		Room['writeScopes'] = 'Room - Modify Write Scopes'
		Room['deleteScopes'] = 'Room - Modify Delete Scopes'
		Room['id'] = 'Room - Modify Id'
		Room['createdAt'] = 'Room - Modify Created At'
		Room['updatedAt'] = 'Room - Modify Updated At'
	})(Room = PUT.Room || (PUT.Room = {}))
	let Message;
	(function (Message) {
		Message['data'] = 'Message - Modify Data'
		Message['id'] = 'Message - Modify Id'
		Message['createdAt'] = 'Message - Modify Created At'
		Message['updatedAt'] = 'Message - Modify Updated At'
	})(Message = PUT.Message || (PUT.Message = {}))
	let DomainRole;
	(function (DomainRole) {
		DomainRole['allows'] = 'Domain Role - Modify Allows'
		DomainRole['blocks'] = 'Domain Role - Modify Blocks'
		DomainRole['rank'] = 'Domain Role - Modify Rank'
		DomainRole['name'] = 'Domain Role - Modify Name'
		DomainRole['graphic'] = 'Domain Role - Modify Graphic'
		DomainRole['id'] = 'Domain Role - Modify Id'
		DomainRole['createdAt'] = 'Domain Role - Modify Created At'
		DomainRole['updatedAt'] = 'Domain Role - Modify Updated At'
	})(DomainRole = PUT.DomainRole || (PUT.DomainRole = {}))
})(PUT || (PUT = {}))
export var POST;
(function (POST) {
	let User;
	(function (User) {
		User['domainRoles'] = 'User - Add Domain Roles'
		User['globalRoles'] = 'User - Add Global Roles'
		User['domain'] = 'User - Add Domain'
		User['messages'] = 'User - Add Messages'
	})(User = POST.User || (POST.User = {}))
	let GlobalRole;
	(function (GlobalRole) {
		GlobalRole['users'] = 'Global Role - Add Users'
	})(GlobalRole = POST.GlobalRole || (POST.GlobalRole = {}))
	let Domain;
	(function (Domain) {
		Domain['developer'] = 'Domain - Add Developer'
		Domain['channel'] = 'Domain - Add Channel'
		Domain['roles'] = 'Domain - Add Roles'
		Domain['user'] = 'Domain - Add User'
	})(Domain = POST.Domain || (POST.Domain = {}))
	let Developer;
	(function (Developer) {
		Developer['domain'] = 'Developer - Add Domain'
		Developer['devItems'] = 'Developer - Add Dev Items'
		Developer['storeItems'] = 'Developer - Add Store Items'
	})(Developer = POST.Developer || (POST.Developer = {}))
	let DevItem;
	(function (DevItem) {
		DevItem['developer'] = 'Dev Item - Add Developer'
		DevItem['storeItem'] = 'Dev Item - Add Store Item'
	})(DevItem = POST.DevItem || (POST.DevItem = {}))
	let StoreItem;
	(function (StoreItem) {
		StoreItem['developer'] = 'Store Item - Add Developer'
		StoreItem['devItem'] = 'Store Item - Add Dev Item'
		StoreItem['widgets'] = 'Store Item - Add Widgets'
	})(StoreItem = POST.StoreItem || (POST.StoreItem = {}))
	let Channel;
	(function (Channel) {
		Channel['widgets'] = 'Channel - Add Widgets'
		Channel['domain'] = 'Channel - Add Domain'
	})(Channel = POST.Channel || (POST.Channel = {}))
	let Widget;
	(function (Widget) {
		Widget['storeItem'] = 'Widget - Add Store Item'
		Widget['rooms'] = 'Widget - Add Rooms'
		Widget['channel'] = 'Widget - Add Channel'
	})(Widget = POST.Widget || (POST.Widget = {}))
	let Room;
	(function (Room) {
		Room['messages'] = 'Room - Add Messages'
		Room['widget'] = 'Room - Add Widget'
	})(Room = POST.Room || (POST.Room = {}))
	let Message;
	(function (Message) {
		Message['room'] = 'Message - Add Room'
		Message['user'] = 'Message - Add User'
	})(Message = POST.Message || (POST.Message = {}))
	let DomainRole;
	(function (DomainRole) {
		DomainRole['domain'] = 'Domain Role - Add Domain'
		DomainRole['users'] = 'Domain Role - Add Users'
		DomainRole['canAssign'] = 'Domain Role - Add Can Assign'
	})(DomainRole = POST.DomainRole || (POST.DomainRole = {}))
})(POST || (POST = {}))
export var DELETE;
(function (DELETE) {
	let User;
	(function (User) {
		User['domainRoles'] = 'User - Delete Domain Roles'
		User['globalRoles'] = 'User - Delete Global Roles'
		User['domain'] = 'User - Delete Domain'
		User['messages'] = 'User - Delete Messages'
	})(User = DELETE.User || (DELETE.User = {}))
	let GlobalRole;
	(function (GlobalRole) {
		GlobalRole['users'] = 'Global Role - Delete Users'
	})(GlobalRole = DELETE.GlobalRole || (DELETE.GlobalRole = {}))
	let Domain;
	(function (Domain) {
		Domain['developer'] = 'Domain - Delete Developer'
		Domain['channel'] = 'Domain - Delete Channel'
		Domain['roles'] = 'Domain - Delete Roles'
		Domain['user'] = 'Domain - Delete User'
	})(Domain = DELETE.Domain || (DELETE.Domain = {}))
	let Developer;
	(function (Developer) {
		Developer['domain'] = 'Developer - Delete Domain'
		Developer['devItems'] = 'Developer - Delete Dev Items'
		Developer['storeItems'] = 'Developer - Delete Store Items'
	})(Developer = DELETE.Developer || (DELETE.Developer = {}))
	let DevItem;
	(function (DevItem) {
		DevItem['developer'] = 'Dev Item - Delete Developer'
		DevItem['storeItem'] = 'Dev Item - Delete Store Item'
	})(DevItem = DELETE.DevItem || (DELETE.DevItem = {}))
	let StoreItem;
	(function (StoreItem) {
		StoreItem['developer'] = 'Store Item - Delete Developer'
		StoreItem['devItem'] = 'Store Item - Delete Dev Item'
		StoreItem['widgets'] = 'Store Item - Delete Widgets'
	})(StoreItem = DELETE.StoreItem || (DELETE.StoreItem = {}))
	let Channel;
	(function (Channel) {
		Channel['widgets'] = 'Channel - Delete Widgets'
		Channel['domain'] = 'Channel - Delete Domain'
	})(Channel = DELETE.Channel || (DELETE.Channel = {}))
	let Widget;
	(function (Widget) {
		Widget['storeItem'] = 'Widget - Delete Store Item'
		Widget['rooms'] = 'Widget - Delete Rooms'
		Widget['channel'] = 'Widget - Delete Channel'
	})(Widget = DELETE.Widget || (DELETE.Widget = {}))
	let Room;
	(function (Room) {
		Room['messages'] = 'Room - Delete Messages'
		Room['widget'] = 'Room - Delete Widget'
	})(Room = DELETE.Room || (DELETE.Room = {}))
	let Message;
	(function (Message) {
		Message['room'] = 'Message - Delete Room'
		Message['user'] = 'Message - Delete User'
	})(Message = DELETE.Message || (DELETE.Message = {}))
	let DomainRole;
	(function (DomainRole) {
		DomainRole['domain'] = 'Domain Role - Delete Domain'
		DomainRole['users'] = 'Domain Role - Delete Users'
		DomainRole['canAssign'] = 'Domain Role - Delete Can Assign'
	})(DomainRole = DELETE.DomainRole || (DELETE.DomainRole = {}))
})(DELETE || (DELETE = {}))
