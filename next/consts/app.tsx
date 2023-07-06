export const AppName = "SimpleTodo"
export const ApiURL = `${process.env.NEXT_PUBLIC_APP_URL}/api`
export const ApiGateway =
    typeof window === "undefined" ? process.env.API_GATEWAY_URL : process.env.NEXT_PUBLIC_API_GATEWAY
