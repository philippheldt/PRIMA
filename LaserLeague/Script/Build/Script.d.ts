declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare function startCAnimation(): void;
declare function stopCAnimation(): void;
declare function startHAnimation(): void;
declare function stopHAnimation(): void;
