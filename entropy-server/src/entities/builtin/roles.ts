import {GET, POST, PUT, DELETE} from './scopes'
export const SCOPE_REGEX = /^[a-z0-9\-\:]+$/i

export const ANON_SCOPES = [
    GET.GlobalRole.id,
    GET.GlobalRole.name,
    GET.GlobalRole.graphic,

    GET.Domain.id,
    GET.Domain.handle,
    GET.Domain.everyoneScopes,
    GET.Domain.anonScopes,

    GET.DomainRole.id,
    GET.DomainRole.graphic,
    GET.DomainRole.name,

    GET.StoreItem.id,
    GET.StoreItem.location,

    GET.Channel.id,
    GET.Channel.activeLayout,
    GET.Channel.templateLayouts,

    GET.Widget.id,
    GET.Widget.config,

    GET.Room.id,
    GET.Room.name,

    GET.Message.id,
    GET.Message.data,
]

export const EVERYONE_SCOPES = [
    ...ANON_SCOPES,
    POST.Room.messages
]

export const MODERATOR_SCOPES = [
    ...EVERYONE_SCOPES,
    POST.DomainRole.users,
//=====================DELETE=====================
    DELETE.DomainRole.users,
    DELETE.Room.messages,
]

export const OWNER_SCOPES = [
    ...MODERATOR_SCOPES,
//=====================GET=====================
    GET.Domain.everyoneScopes,
    GET.Domain.anonScopes,

    GET.Developer.id,
    GET.Developer.apiKey,

    GET.DomainRole.rank,
    GET.DomainRole.allows,
    GET.DomainRole.blocks,

    GET.StoreItem.description,
    GET.StoreItem.config,
//=====================POST=====================
    POST.Domain.channel,
    POST.Domain.developer,
    POST.Domain.roles,
    
    POST.DomainRole.canAssign,
    
    POST.Developer.devItems,

    POST.Channel.widgets,
//=====================PUT=====================
    PUT.Domain.anonScopes,
    PUT.Domain.everyoneScopes,
    PUT.Domain.handle,

    PUT.DomainRole.allows,
    PUT.DomainRole.blocks,
    PUT.DomainRole.graphic,
    PUT.DomainRole.name,

    PUT.Channel.activeLayout,
    PUT.Channel.templateLayouts,

    PUT.DevItem.config,
    PUT.DevItem.name,

    PUT.StoreItem.config,
    PUT.StoreItem.description,
//=====================DELETE=====================
    DELETE.DomainRole.canAssign,
    DELETE.DomainRole.users,

    DELETE.Channel.widgets,

    DELETE.Developer.devItems,
]

export const BANNED_BLOCKED_SCOPES = [
    POST.Room.messages
]

export const ADMIN_SCOPES =  [
    ...Object.values(GET).flatMap(object=> Object.values(object)),
    ...Object.values(POST).flatMap(object=> Object.values(object)),
    ...Object.values(PUT).flatMap(object=> Object.values(object)),
    ...Object.values(DELETE).flatMap(object=> Object.values(object)),
    'Entropy Admin'
]