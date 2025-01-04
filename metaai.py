from meta_ai_api import MetaAI

ai = MetaAI()
response = ai.prompt(message="Whats the weather in San Francisco today? And what is the date?")
print(response)

#  response = ai.prompt(message="https://github.com/rahul-nakum14/College-Managment-System create a readme.md file for this repo include all the parameters and endpoints")
