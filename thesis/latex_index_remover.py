import re

with open("build/latex/progettazioneesviluppodisophonapplicativocloudasupportodellaricerca.tex", "r") as file:
    print("Reading file...")
    text = file.read()

print("Performing first sub...", end=" ")
text, number = re.subn(r"\\renewcommand[{]\\indexname[}][{]Indice del modulo Python[}].*?\\end[{]sphinxtheindex[}]", "", text, flags=re.DOTALL)
print(number)

print("Performing second sub...", end=" ")
text, number = re.subn(r"\\renewcommand[{]\\indexname[}][{]HTTP Routing Table[}].*?\\end[{]sphinxtheindex[}]", "", text, flags=re.DOTALL)
print(number)

with open("build/latex/progettazioneesviluppodisophonapplicativocloudasupportodellaricerca.tex", "w") as file:
    print("Writing file...")
    file.write(text)

print("Done!")
