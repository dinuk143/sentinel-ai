class Risk:
    def __init__(self,risk_id,description,likelihood,impact,mitigation):
        self.risk_id=risk_id
        self.description=description
        self.likelihood=likelihood
        self.impact=impact
        self.mitigation=mitigation
        self.score=self.calculate_score()
        self.level=self.assess_level()

    def calculate_score(self):
        return self.likelihood*self.impact

    def assess_level(self):
        if self.score<=4:return "Low"
        elif self.score<=9:return "Medium"
        elif self.score<=15:return "High"
        return "Critical"

    def display(self):
        print(f"Risk ID: {self.risk_id}")
        print(f"Description: {self.description}")
        print(f"Likelihood: {self.likelihood}")
        print(f"Impact: {self.impact}")
        print(f"Risk Score: {self.score}")
        print(f"Risk Level: {self.level}")
        print(f"Mitigation: {self.mitigation}")
        print("-"*40)

risk_register=[
    Risk(1,"Gemini AI service unavailable",4,5,"Use retry and fallback mechanism"),
    Risk(2,"Incorrect AI emergency detection",3,5,"Improve prompts and validate results"),
    Risk(3,"GPS or address failure",3,5,"Provide location error handling"),
    Risk(4,"Google Maps service unavailable",2,4,"Use API error handling and fallback"),
    Risk(5,"Unauthorized access",3,5,"Use JWT authentication and bcrypt"),
]

print("\n--- SENTINEL AI RISK REGISTER ---\n")
for risk in risk_register:
    risk.display()