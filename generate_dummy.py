import pandas as pd
import numpy as np

data = {
    "Nama Lengkap": ["Budi Santoso", "Andi", "Andi", "Citra", "Dewi", "Eko", "Fajar"],
    "NIK": ["3201010101", "3201010102", "3201010102", np.nan, "3201010104", "3201010105", np.nan],
    "Umur ": [25, np.nan, np.nan, 30, 22, np.nan, 45],
    " Alamat ": ["Jl. Mawar", "Jl. Melati", "Jl. Melati", "Jl. Anggrek", np.nan, "Jl. Kenanga", "Jl. Kamboja"]
}

df = pd.DataFrame(data)
df.to_excel("data_warga_mentah.xlsx", index=False)
print("File data_warga_mentah.xlsx berhasil dibuat!")
