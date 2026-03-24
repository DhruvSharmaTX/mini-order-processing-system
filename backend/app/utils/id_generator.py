import random
import string

def generate_id(prefix: str):
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}_{random_part}"