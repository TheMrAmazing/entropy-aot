export declare abstract class Component {
    sel: any;
    data: any;
    children: any;
    elm: any;
    text: any;
    key: any;
    initialRender: boolean;
    slots: any;
    abstract render(slots?: any): any;
    h(slots?: any): any;
    patch(): void;
}
