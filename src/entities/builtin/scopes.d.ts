export declare namespace GET {
    enum User {
        email = "User - View Email",
        password = "User - View Password",
        name = "User - View Name",
        verified = "User - View Verified",
        image = "User - View Image",
        id = "User - View Id",
        createdAt = "User - View Created At",
        updatedAt = "User - View Updated At"
    }
    enum GlobalRole {
        allows = "Global Role - View Allows",
        blocks = "Global Role - View Blocks",
        rank = "Global Role - View Rank",
        name = "Global Role - View Name",
        graphic = "Global Role - View Graphic",
        id = "Global Role - View Id",
        createdAt = "Global Role - View Created At",
        updatedAt = "Global Role - View Updated At"
    }
    enum Domain {
        handle = "Domain - View Handle",
        everyoneScopes = "Domain - View Everyone Scopes",
        anonScopes = "Domain - View Anon Scopes",
        id = "Domain - View Id",
        createdAt = "Domain - View Created At",
        updatedAt = "Domain - View Updated At"
    }
    enum Developer {
        apiKey = "Developer - View Api Key",
        id = "Developer - View Id",
        createdAt = "Developer - View Created At",
        updatedAt = "Developer - View Updated At"
    }
    enum DevItem {
        location = "Dev Item - View Location",
        name = "Dev Item - View Name",
        status = "Dev Item - View Status",
        config = "Dev Item - View Config",
        id = "Dev Item - View Id",
        createdAt = "Dev Item - View Created At",
        updatedAt = "Dev Item - View Updated At"
    }
    enum StoreItem {
        location = "Store Item - View Location",
        name = "Store Item - View Name",
        description = "Store Item - View Description",
        config = "Store Item - View Config",
        id = "Store Item - View Id",
        createdAt = "Store Item - View Created At",
        updatedAt = "Store Item - View Updated At"
    }
    enum Channel {
        activeLayout = "Channel - View Active Layout",
        templateLayouts = "Channel - View Template Layouts",
        id = "Channel - View Id",
        createdAt = "Channel - View Created At",
        updatedAt = "Channel - View Updated At"
    }
    enum Widget {
        config = "Widget - View Config",
        id = "Widget - View Id",
        createdAt = "Widget - View Created At",
        updatedAt = "Widget - View Updated At"
    }
    enum Room {
        name = "Room - View Name",
        readScopes = "Room - View Read Scopes",
        writeScopes = "Room - View Write Scopes",
        deleteScopes = "Room - View Delete Scopes",
        id = "Room - View Id",
        createdAt = "Room - View Created At",
        updatedAt = "Room - View Updated At"
    }
    enum Message {
        data = "Message - View Data",
        id = "Message - View Id",
        createdAt = "Message - View Created At",
        updatedAt = "Message - View Updated At"
    }
    enum DomainRole {
        allows = "Domain Role - View Allows",
        blocks = "Domain Role - View Blocks",
        rank = "Domain Role - View Rank",
        name = "Domain Role - View Name",
        graphic = "Domain Role - View Graphic",
        id = "Domain Role - View Id",
        createdAt = "Domain Role - View Created At",
        updatedAt = "Domain Role - View Updated At"
    }
}
export declare namespace PUT {
    enum User {
        email = "User - Modify Email",
        password = "User - Modify Password",
        name = "User - Modify Name",
        verified = "User - Modify Verified",
        image = "User - Modify Image",
        id = "User - Modify Id",
        createdAt = "User - Modify Created At",
        updatedAt = "User - Modify Updated At"
    }
    enum GlobalRole {
        allows = "Global Role - Modify Allows",
        blocks = "Global Role - Modify Blocks",
        rank = "Global Role - Modify Rank",
        name = "Global Role - Modify Name",
        graphic = "Global Role - Modify Graphic",
        id = "Global Role - Modify Id",
        createdAt = "Global Role - Modify Created At",
        updatedAt = "Global Role - Modify Updated At"
    }
    enum Domain {
        handle = "Domain - Modify Handle",
        everyoneScopes = "Domain - Modify Everyone Scopes",
        anonScopes = "Domain - Modify Anon Scopes",
        id = "Domain - Modify Id",
        createdAt = "Domain - Modify Created At",
        updatedAt = "Domain - Modify Updated At"
    }
    enum Developer {
        apiKey = "Developer - Modify Api Key",
        id = "Developer - Modify Id",
        createdAt = "Developer - Modify Created At",
        updatedAt = "Developer - Modify Updated At"
    }
    enum DevItem {
        location = "Dev Item - Modify Location",
        name = "Dev Item - Modify Name",
        status = "Dev Item - Modify Status",
        config = "Dev Item - Modify Config",
        id = "Dev Item - Modify Id",
        createdAt = "Dev Item - Modify Created At",
        updatedAt = "Dev Item - Modify Updated At"
    }
    enum StoreItem {
        location = "Store Item - Modify Location",
        name = "Store Item - Modify Name",
        description = "Store Item - Modify Description",
        config = "Store Item - Modify Config",
        id = "Store Item - Modify Id",
        createdAt = "Store Item - Modify Created At",
        updatedAt = "Store Item - Modify Updated At"
    }
    enum Channel {
        activeLayout = "Channel - Modify Active Layout",
        templateLayouts = "Channel - Modify Template Layouts",
        id = "Channel - Modify Id",
        createdAt = "Channel - Modify Created At",
        updatedAt = "Channel - Modify Updated At"
    }
    enum Widget {
        config = "Widget - Modify Config",
        id = "Widget - Modify Id",
        createdAt = "Widget - Modify Created At",
        updatedAt = "Widget - Modify Updated At"
    }
    enum Room {
        name = "Room - Modify Name",
        readScopes = "Room - Modify Read Scopes",
        writeScopes = "Room - Modify Write Scopes",
        deleteScopes = "Room - Modify Delete Scopes",
        id = "Room - Modify Id",
        createdAt = "Room - Modify Created At",
        updatedAt = "Room - Modify Updated At"
    }
    enum Message {
        data = "Message - Modify Data",
        id = "Message - Modify Id",
        createdAt = "Message - Modify Created At",
        updatedAt = "Message - Modify Updated At"
    }
    enum DomainRole {
        allows = "Domain Role - Modify Allows",
        blocks = "Domain Role - Modify Blocks",
        rank = "Domain Role - Modify Rank",
        name = "Domain Role - Modify Name",
        graphic = "Domain Role - Modify Graphic",
        id = "Domain Role - Modify Id",
        createdAt = "Domain Role - Modify Created At",
        updatedAt = "Domain Role - Modify Updated At"
    }
}
export declare namespace POST {
    enum User {
        domainRoles = "User - Add Domain Roles",
        globalRoles = "User - Add Global Roles",
        domain = "User - Add Domain",
        messages = "User - Add Messages"
    }
    enum GlobalRole {
        users = "Global Role - Add Users"
    }
    enum Domain {
        developer = "Domain - Add Developer",
        channel = "Domain - Add Channel",
        roles = "Domain - Add Roles",
        user = "Domain - Add User"
    }
    enum Developer {
        domain = "Developer - Add Domain",
        devItems = "Developer - Add Dev Items",
        storeItems = "Developer - Add Store Items"
    }
    enum DevItem {
        developer = "Dev Item - Add Developer",
        storeItem = "Dev Item - Add Store Item"
    }
    enum StoreItem {
        developer = "Store Item - Add Developer",
        devItem = "Store Item - Add Dev Item",
        widgets = "Store Item - Add Widgets"
    }
    enum Channel {
        widgets = "Channel - Add Widgets",
        domain = "Channel - Add Domain"
    }
    enum Widget {
        storeItem = "Widget - Add Store Item",
        rooms = "Widget - Add Rooms",
        channel = "Widget - Add Channel"
    }
    enum Room {
        messages = "Room - Add Messages",
        widget = "Room - Add Widget"
    }
    enum Message {
        room = "Message - Add Room",
        user = "Message - Add User"
    }
    enum DomainRole {
        domain = "Domain Role - Add Domain",
        users = "Domain Role - Add Users",
        canAssign = "Domain Role - Add Can Assign"
    }
}
export declare namespace DELETE {
    enum User {
        domainRoles = "User - Delete Domain Roles",
        globalRoles = "User - Delete Global Roles",
        domain = "User - Delete Domain",
        messages = "User - Delete Messages"
    }
    enum GlobalRole {
        users = "Global Role - Delete Users"
    }
    enum Domain {
        developer = "Domain - Delete Developer",
        channel = "Domain - Delete Channel",
        roles = "Domain - Delete Roles",
        user = "Domain - Delete User"
    }
    enum Developer {
        domain = "Developer - Delete Domain",
        devItems = "Developer - Delete Dev Items",
        storeItems = "Developer - Delete Store Items"
    }
    enum DevItem {
        developer = "Dev Item - Delete Developer",
        storeItem = "Dev Item - Delete Store Item"
    }
    enum StoreItem {
        developer = "Store Item - Delete Developer",
        devItem = "Store Item - Delete Dev Item",
        widgets = "Store Item - Delete Widgets"
    }
    enum Channel {
        widgets = "Channel - Delete Widgets",
        domain = "Channel - Delete Domain"
    }
    enum Widget {
        storeItem = "Widget - Delete Store Item",
        rooms = "Widget - Delete Rooms",
        channel = "Widget - Delete Channel"
    }
    enum Room {
        messages = "Room - Delete Messages",
        widget = "Room - Delete Widget"
    }
    enum Message {
        room = "Message - Delete Room",
        user = "Message - Delete User"
    }
    enum DomainRole {
        domain = "Domain Role - Delete Domain",
        users = "Domain Role - Delete Users",
        canAssign = "Domain Role - Delete Can Assign"
    }
}
