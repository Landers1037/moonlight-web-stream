
export type TextEvent = CustomEvent<{ text: string }>

export class ScreenKeyboard {

    private eventTarget = new EventTarget()
    private fakeElement = document.createElement("input")

    private visible: boolean = false

    constructor() {
        this.fakeElement.classList.add("hiddeninput")
        this.fakeElement.type = "text"
        this.fakeElement.name = "keyboard"
        this.fakeElement.enterKeyHint = "enter"
        this.fakeElement.autocomplete = "off"
        this.fakeElement.autocapitalize = "off"
        this.fakeElement.spellcheck = false
        if ("autocorrect" in this.fakeElement) {
            this.fakeElement.autocorrect = false
        }

        this.fakeElement.addEventListener("input", this.onKeyInput.bind(this))
        this.fakeElement.addEventListener("keydown", this.onKeyDown.bind(this))
        this.fakeElement.addEventListener("keyup", this.onKeyUp.bind(this))

        document.addEventListener("click", this.hide.bind(this))
        this.fakeElement.addEventListener("blur", this.hide.bind(this))
    }

    getHiddenElement() {
        return this.fakeElement
    }

    show() {
        if (!this.visible) {
            this.visible = true

            this.fakeElement.focus()
        }
    }
    hide() {
        if (this.visible) {
            this.visible = false

            this.fakeElement.focus()
            this.fakeElement.blur()
        }
    }

    isVisible(): boolean {
        return this.visible
    }

    addKeyDownListener(listener: (event: KeyboardEvent) => void) {
        this.eventTarget.addEventListener("keydown", listener as any)
    }
    addKeyUpListener(listener: (event: KeyboardEvent) => void) {
        this.eventTarget.addEventListener("keyup", listener as any)
    }
    addTextListener(listener: (event: TextEvent) => void) {
        this.eventTarget.addEventListener("ml-text", listener as any)
    }

    // -- Events
    private onKeyDown(event: KeyboardEvent) {
        event.stopPropagation()
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault()
            const keyDown = new KeyboardEvent("keydown", {
                code: "Enter"
            })
            const keyUp = new KeyboardEvent("keyup", {
                code: "Enter"
            })
            this.eventTarget.dispatchEvent(keyDown)
            this.eventTarget.dispatchEvent(keyUp)
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        event.stopPropagation()
    }

    private onKeyInput(event: Event) {
        if (!(event instanceof InputEvent)) {
            return
        }
        if (event.isComposing) {
            return
        }

        if ((event.inputType == "insertText" || event.inputType == "insertFromPaste" || event.inputType == "insertCompositionText") && event.data != null) {
            const customEvent: TextEvent = new CustomEvent("ml-text", {
                detail: { text: event.data }
            })

            this.eventTarget.dispatchEvent(customEvent)
        } else if (event.inputType == "insertLineBreak") {
            const keyDown = new KeyboardEvent("keydown", {
                code: "Enter"
            })
            const keyUp = new KeyboardEvent("keyup", {
                code: "Enter"
            })

            this.eventTarget.dispatchEvent(keyDown)
            this.eventTarget.dispatchEvent(keyUp)
        } else if (event.inputType == "deleteContentBackward" || event.inputType == "deleteByCut") {
            const keyDown = new KeyboardEvent("keydown", {
                code: "Backspace"
            })
            const keyUp = new KeyboardEvent("keyup", {
                code: "Backspace"
            })

            this.eventTarget.dispatchEvent(keyDown)
            this.eventTarget.dispatchEvent(keyUp)
        } else if (event.inputType == "deleteContentForward") {
            const keyDown = new KeyboardEvent("keydown", {
                code: "Delete"
            })
            const keyUp = new KeyboardEvent("keyup", {
                code: "Delete"
            })

            this.eventTarget.dispatchEvent(keyDown)
            this.eventTarget.dispatchEvent(keyUp)
        }

        // Repopulate the input so that the deleteContent commands will work
        this.fakeElement.value = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
}