const useAiModel = (model: string) => {
  const api = `/api/${model}`

  const generateMessage = async (message: string) => {
    const response = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err) => {
      console.log(JSON.stringify(err))
      throw err
    })

    if (!response.ok) {
      throw new Error(
        (await response.text()) || 'Failed to fetch the chat response.',
      )
    }

    if (!response.body) {
      throw new Error('The response body is empty.')
    }

    return response.text()
  }

  return {
    generateMessage,
  }
}

export default useAiModel
