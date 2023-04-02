from main import Prompt
import openai

def generate_text(prompt: Prompt, max_tokens=1000):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=max_tokens,
        n=1,
        stop=None,
        temperature=1,
    )
    return response.choices[0].text.strip()

