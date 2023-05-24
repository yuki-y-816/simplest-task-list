import React from "react"

export const RenderingErrorMessage = (message: string): JSX.Element => {
    return <p className="text-red-400">{message}</p>
}
