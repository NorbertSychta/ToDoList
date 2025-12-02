import os

msg = os.getenv("MESSAGE", "Brak zmiennej MESSAGE!")
print("Skrypt pytona działa.")
print("Zmienna środowiskowa MESSAGE:", msg)
