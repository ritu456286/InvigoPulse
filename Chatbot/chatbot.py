import re
import random

class ChatBot:
    def __init__(self):
        self.responses = {
            "hello": ["Hello!", "Hi there!", "Hey!"],
            "how are you": ["I'm just a bot, but I'm functioning well. Thanks for asking!", "I'm a bot, so I don't have feelings, but I'm here to help you."],
            "bye": ["Goodbye!", "See you later!", "Have a nice day!"],
            "feedback": [ "Thank you for your feedback!", "I'm glad you found my responses helpful.", "I'm sorry to hear that. I'll try to improve my responses in the future."],
            "I have a query":["Please elaborate your query, I am here for solutions."]
        }
        self.patterns = {
            r'hi|hello|hey': 'hello',
            r'how are you|how r u|how are you doing': 'how are you',
            r'bye|goodbye|see you': 'bye',
            r'feedback|rate|evaluate': 'feedback',
            r'query|question|doubt': 'I have a query'
        }

    def get_response(self, user_input):
        user_input = user_input.lower()
        for pattern, response in self.patterns.items():
            if re.search(pattern, user_input):
                return random.choice(self.responses[response])
        return "I'm not sure how to respond to that. Can you please try again?"

    def get_feedback(self, feedback):
        if feedback.lower() in ['great', 'good', 'helpful', 'useful']:
            return self.responses['feedback'][1]
        elif feedback.lower() in ['bad', 'unhelpful', 'terrible', 'useless']:
            return self.responses['feedback'][2]
        else:
            return self.responses['feedback'][0]

def main():
    bot = ChatBot()
    print("Hi, I'm Invigo assistant! How can I help you?")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'bye':
            print("Bot: " + bot.get_response('bye'))
            break
        elif user_input.lower() == 'feedback':
            feedback = input("Please enter your feedback: ")
            print("Bot: " + bot.get_feedback(feedback))
        else:
            print("Bot: " + bot.get_response(user_input))

if __name__ == "__main__":
    main()

