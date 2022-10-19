import { GET, POST, PUT, DELETE } from './scopes'
export declare const SCOPE_REGEX: RegExp
export declare const ANON_SCOPES: (GET.GlobalRole | GET.Domain | GET.StoreItem | GET.Channel | GET.Widget | GET.Room | GET.Message | GET.DomainRole)[]
export declare const EVERYONE_SCOPES: (GET.GlobalRole | GET.Domain | GET.StoreItem | GET.Channel | GET.Widget | GET.Room | GET.Message | GET.DomainRole | POST.Room)[]
export declare const MODERATOR_SCOPES: (GET.GlobalRole | GET.Domain | GET.StoreItem | GET.Channel | GET.Widget | GET.Room | GET.Message | GET.DomainRole | POST.Room | POST.DomainRole | DELETE.Room | DELETE.DomainRole)[]
export declare const OWNER_SCOPES: (GET.GlobalRole | GET.Domain | GET.Developer | GET.StoreItem | GET.Channel | GET.Widget | GET.Room | GET.Message | GET.DomainRole | PUT.Domain | PUT.DevItem | PUT.StoreItem | PUT.Channel | PUT.DomainRole | POST.Domain | POST.Developer | POST.Channel | POST.Room | POST.DomainRole | DELETE.Developer | DELETE.Channel | DELETE.Room | DELETE.DomainRole)[]
export declare const BANNED_BLOCKED_SCOPES: POST.Room[]
export declare const ADMIN_SCOPES: any[]
