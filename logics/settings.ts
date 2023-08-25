export type AppSettings = {
  isOnlyWrongs: boolean
  enableWrongsCount: number
}

export const defaultAppSettings: AppSettings = {
  isOnlyWrongs: false,
  enableWrongsCount: 1,
}

const key = "english-study-settings"

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(key, JSON.stringify(settings))
}

export const loadSettings = (): AppSettings => ({
  ...defaultAppSettings,
  ...JSON.parse(localStorage.getItem(key) || "{}"),
})
