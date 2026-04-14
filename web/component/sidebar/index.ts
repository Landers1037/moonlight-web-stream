import { Component } from "../index.js"
import { showErrorPopup } from "../error.js"

export interface Sidebar extends Component {
    extended(): void
    unextend(): void
}

let sidebarExtended = false
const sidebarRoot = document.getElementById("sidebar-root")
const sidebarParent = document.getElementById("sidebar-parent")
const sidebarButton = document.getElementById("sidebar-button")

let isDragging = false;
let startY = 0;
let startTop = 0;

sidebarButton?.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    
    isDragging = false;
    startY = e.clientY;
    if (!sidebarRoot) return;
    
    const computedStyle = window.getComputedStyle(sidebarRoot);
    startTop = parseFloat(computedStyle.top);
    
    function onPointerMove(moveEvent: PointerEvent) {
        const deltaY = moveEvent.clientY - startY;
        if (Math.abs(deltaY) > 5) {
            isDragging = true;
            sidebarButton?.setPointerCapture(moveEvent.pointerId);
        }
        if (isDragging && sidebarRoot) {
            const maxY = window.innerHeight;
            const newTop = Math.max(0, Math.min(startTop + deltaY, maxY));
            sidebarRoot.style.top = `${newTop}px`;
        }
    }
    
    function onPointerUp(upEvent: PointerEvent) {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        document.removeEventListener("pointercancel", onPointerUp);
        
        if (sidebarButton && isDragging) {
            try {
                sidebarButton.releasePointerCapture(upEvent.pointerId);
            } catch (e) {}
        }
    }
    
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
});

sidebarButton?.addEventListener("click", (e) => {
    if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
    } else {
        toggleSidebar();
    }
});

let sidebarComponent: Sidebar | null = null

export type SidebarEdge = "up" | "down" | "left" | "right"
export type SidebarStyle = {
    edge?: SidebarEdge
}

export function setSidebarStyle(style: SidebarStyle) {
    // Default values
    const edge = style.edge ?? "left"

    // Set edge
    sidebarRoot?.classList.remove("sidebar-edge-left", "sidebar-edge-right", "sidebar-edge-up", "sidebar-edge-down")
    sidebarRoot?.classList.add(`sidebar-edge-${edge}`)
}

export function toggleSidebar() {
    setSidebarExtended(!isSidebarExtended())
}
export function setSidebarExtended(extended: boolean) {
    if (extended == sidebarExtended) {
        return
    }

    if (extended) {
        sidebarRoot?.classList.add("sidebar-show")
    } else {
        sidebarRoot?.classList.remove("sidebar-show")
    }
    sidebarExtended = extended
}
export function isSidebarExtended(): boolean {
    return sidebarExtended
}

export function setSidebar(sidebar: Sidebar | null) {
    if (sidebarParent == null || sidebarRoot == null) {
        showErrorPopup("failed to get sidebar")
        return
    }

    if (sidebarComponent) {
        // unmount
        sidebarComponent?.unmount(sidebarParent)
        sidebarComponent = null
        sidebarRoot.style.visibility = "hidden"
    }
    if (sidebar) {
        // mount
        sidebarComponent = sidebar
        sidebar?.mount(sidebarParent)
        sidebarRoot.style.visibility = "visible"
    }
}

export function getSidebarRoot(): HTMLElement | null {
    return sidebarRoot
}

// initialize defaults
setSidebarStyle({
    edge: "left"
})
setSidebar(null)