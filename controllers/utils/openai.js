module.exports = {
  chatGPT,
};

async function chatGPT(openai, prompt) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });
    console.log(response.data.choices[0].text);
    return response.data.choices[0].text;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}
