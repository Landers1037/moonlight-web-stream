import { ComponentEvent } from "../index.js"
import { getCurrentLanguage, getTranslations } from "../../i18n.js"
import { InputComponent } from "../input.js"
import { FormModal } from "./form.js"

export type UserAuth = {
    name: string,
    password: string
}

export class ApiUserPasswordPrompt extends FormModal<UserAuth> {

    private titleContainer: HTMLElement = document.createElement("div")
    private appTitle: HTMLElement = document.createElement("h2")
    private text: HTMLElement = document.createElement("h3")

    private name: InputComponent
    private password: InputComponent
    private passwordFile: InputComponent

    constructor() {
        super()
        const i = getTranslations(getCurrentLanguage()).modal

        this.appTitle.innerText = "Moonlight"
        this.appTitle.style.textAlign = "center"
        this.appTitle.style.margin = "0 0 8px 0"
        this.appTitle.style.fontSize = "2rem"
        this.appTitle.style.fontWeight = "800"
        
        this.text.innerText = i.login
        this.text.style.fontSize = "1.25rem"
        this.text.style.color = "rgba(255,255,255,0.7)"

        this.titleContainer.style.display = "flex"
        this.titleContainer.style.flexDirection = "column"
        this.titleContainer.style.alignItems = "center"
        this.titleContainer.style.marginBottom = "24px"
        this.titleContainer.appendChild(this.appTitle)
        this.titleContainer.appendChild(this.text)

        this.name = new InputComponent("ml-api-name", "text", i.username, {
            formRequired: true
        })

        this.password = new InputComponent("ml-api-password", "password", i.password, {
            formRequired: true
        })

        this.passwordFile = new InputComponent("ml-api-password-file", "file", i.passwordAsFile, { accept: ".txt" })
        this.passwordFile.addChangeListener(this.setFilePassword.bind(this))
    }

    private async setFilePassword(event: ComponentEvent<InputComponent>) {
        const files = event.component.getFiles()
        if (!files) {
            return
        }

        const file = files[0]
        if (!file) {
            return
        }
        const text = await file.text()

        // Remove carriage return and new line
        const password = text
            .replace(/\r/g, "")
            .replace(/\n/g, "")

        this.password.setValue(password)
    }

    reset(): void {
        this.name.reset()
        this.password.reset()
        this.passwordFile.reset()
    }
    submit(): UserAuth | null {
        const name = this.name.getValue()
        const password = this.password.getValue()

        if (name && password) {
            return { name, password }
        } else {
            return null
        }
    }

    onFinish(abort: AbortSignal): Promise<UserAuth | null> {
        const abortController = new AbortController()
        abort.addEventListener("abort", abortController.abort.bind(abortController))

        return new Promise((resolve, reject) => {
            super.onFinish(abortController.signal).then((data) => {
                abortController.abort()
                resolve(data)
            }, (data) => {
                abortController.abort()
                reject(data)
            })
        })
    }

    mountForm(form: HTMLFormElement): void {
        form.appendChild(this.titleContainer)

        this.name.mount(form)

        this.password.mount(form)
        this.passwordFile.mount(form)
    }
}
