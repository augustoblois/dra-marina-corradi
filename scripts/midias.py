"""Pipeline de midia da LP: fotos em AVIF/WebP responsivos e videos curtos em H.264.

As fontes brutas (coleta do Instagram, imprensa, arquivos da clinica) ficam FORA
do repositorio, na pasta `midia/` do cliente. O que entra no repositorio e so o
resultado em `public/media/` e o indice `src/lib/midias.gen.ts`, que o
componente <Foto> le para montar o srcset e reservar a proporcao (CLS zero).

Uso, de dentro de site/:
  python scripts/midias.py                     gera o que ainda nao existe
  python scripts/midias.py --forcar            regenera tudo
  python scripts/midias.py --so dra-hero       gera um item (repetivel)
  python scripts/midias.py --podar             apaga o que saiu de FOTOS e VIDEOS
  python scripts/midias.py --fontes D:/midia   outra pasta de fontes

Requisitos: Pillow com AVIF (12+) e ffmpeg/ffprobe no PATH.
"""
import argparse
import glob
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

sys.stdout.reconfigure(encoding="utf-8")

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "public" / "media"
INDICE = RAIZ / "src" / "lib" / "midias.gen.ts"

POST = "instagram/posts/"
# Material enviado pela clinica (Pasta Dra Marina Corradi.rar, out/2026).
CLI = "cliente/Materiais Dra Marina Corradi/"
LOTE1 = CLI + "1 Lote/"
LOTE2 = CLI + "2 Lote/"
LEVA2 = CLI + "Leva 2/"

# Cada item: nome (vira o arquivo), origem (glob relativo a --fontes) e, se for
# preciso, recorte relativo (x0, y0, x1, y1), quadro (segundo, quando a origem e
# um video) e larguras. Video: tipo "video", inicio/fim em segundos e largura.
FOTOS = [
    # Ensaio profissional (Marina_LR) da pasta da clinica.
    {"nome": "dra-hero", "origem": CLI + "Marina_LR-26.jpg.jpeg",
     "larguras": [480, 828, 1200, 1600]},
    {"nome": "dra-vinho", "origem": CLI + "Marina_LR-10.jpg.jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "dra-sentada", "origem": CLI + "Marina_LR-29.jpg.jpeg",
     "larguras": [480, 828, 1200]},
    # Print da materia do O Globo, separado pelo Augusto (minha-curadoria/).
    {"nome": "imprensa-oglobo", "origem": "../minha-curadoria/oglobo.jpg",
     "larguras": [480, 828, 1080]},

    # Volformer, material da clinica (Leva 2). O comparativo de rosto dividido e
    # a arte publicada no destaque "Volformer"; corto so as margens da arte.
    {"nome": "comparativo-rosto", "origem": LEVA2 + "WhatsApp Image 2026-10-18 at 18.07.19.jpeg",
     "recorte": (0.0, 0.062, 1.0, 0.972), "larguras": [480, 828, 900]},
    # Pares lado a lado com linha branca no meio: cada metade vira uma foto.
    {"nome": "caso-34-antes", "origem": LEVA2 + "WhatsApp Image 2026-10-18 at 18.07.22 (1).jpeg",
     "recorte": (0.0, 0.0, 0.490, 1.0), "larguras": [400, 620]},
    {"nome": "caso-34-depois", "origem": LEVA2 + "WhatsApp Image 2026-10-18 at 18.07.22 (1).jpeg",
     "recorte": (0.503, 0.0, 1.0, 1.0), "larguras": [400, 620]},
    {"nome": "caso-lateral-antes", "origem": LEVA2 + "WhatsApp Image 2026-10-18 at 18.07.22.jpeg",
     "recorte": (0.0, 0.0, 0.492, 1.0), "larguras": [400, 620]},
    {"nome": "caso-lateral-depois", "origem": LEVA2 + "WhatsApp Image 2026-10-18 at 18.07.22.jpeg",
     "recorte": (0.505, 0.0, 1.0, 1.0), "larguras": [400, 620]},
    {"nome": "caso-cadeira-antes", "origem": LEVA2 + "WhatsApp Image 2026-10-18 at 18.07.19 (1).jpeg",
     "recorte": (0.0, 0.0, 0.494, 1.0), "larguras": [400, 620]},
    {"nome": "caso-cadeira-depois", "origem": LEVA2 + "WhatsApp Image 2026-10-18 at 18.07.19 (1).jpeg",
     "recorte": (0.505, 0.0, 1.0, 1.0), "larguras": [400, 620]},

    # Imprensa: as capas que ela mesma publicou de cada materia.
    {"nome": "imprensa-valor", "origem": POST + "2026-05-27-DY2z4_Ckdce-01.jpg",
     "larguras": [320, 480, 720]},
    {"nome": "imprensa-agora", "origem": POST + "2026-09-24-DdrZkp_EV8b-01.jpg",
     "larguras": [320, 480, 720]},
    {"nome": "imprensa-singular", "origem": POST + "2026-10-27-DfAbzpBmnFM-01.jpg",
     "larguras": [320, 480, 720]},

    # Grade do Instagram (8 posts; no celular aparecem os 4 primeiros).
    {"nome": "ig-1", "origem": POST + "2026-10-15-Deh2QqzDxsk-01.jpg", "larguras": [240, 400]},
    {"nome": "ig-2", "origem": POST + "2026-09-09-DdFf_-jhlT0-01-capa-de-video.jpg", "larguras": [240, 400]},
    {"nome": "ig-3", "origem": POST + "2026-10-18-DeovZGskfGM-01.jpg", "larguras": [240, 400]},
    {"nome": "ig-4", "origem": POST + "2026-07-03-DaWMKwFlPb--01.jpg", "larguras": [240, 400]},
    {"nome": "ig-5", "origem": POST + "2026-07-02-DaTgg_pD457-01.jpg", "larguras": [240, 400]},
    {"nome": "ig-6", "origem": POST + "2026-06-29-DaLyJSflKC--01.jpg", "larguras": [240, 400]},
    {"nome": "ig-7", "origem": POST + "2026-03-24-DWSA0vxDy9U-01.jpg", "larguras": [240, 400]},
    {"nome": "ig-8", "origem": POST + "2026-09-09-DdE-iuLJ3Lr-01-capa-de-video.jpg", "larguras": [240, 400]},

    # Outros cuidados da clinica.
    {"nome": "cuidado-goldincision", "origem": "../minha-curadoria/antesdepois3.jpg",
     "larguras": [240, 400]},
    {"nome": "cuidado-laser", "origem": "../minha-curadoria/video-clinica.mp4", "quadro": 151.2,
     "larguras": [240, 400]},
    # Pele em corte, renders oficiais (site da MedSystems). Volnewmer: o recorte
    # tira o icone em caixa branca do canto. Ultraformer: so o painel do MPT 4,5 mm.
    {"nome": "pele-volnewmer", "origem": "medsystems/volnewmer_skin-anatomy_original.webp",
     "recorte": (0.305, 0.0, 1.0, 0.935), "alfa": True, "larguras": [480, 720, 1080]},
    {"nome": "pele-ultraformer", "origem": "medsystems/Micropulse.webp",
     "recorte": (0.008, 0.14, 0.494, 0.985), "larguras": [389]},

    # Stories da propria Dra. O recorte tira a marcacao do perfil da paciente.
    {"nome": "cuidado-facial", "origem": "instagram/destaques/Facial/2026-09-16-05-01-capa-de-video.jpg",
     "recorte": (0.0, 0.105, 1.0, 0.795), "larguras": [240, 400]},
    # A Dra. de mascara e luvas examinando o couro cabeludo de um paciente.
    {"nome": "cuidado-tricologia", "origem": "instagram/destaques/Tricologia/2026-09-15-09-01-capa-de-video.jpg",
     "recorte": (0.0, 0.14, 1.0, 0.844), "larguras": [240, 400]},

    # Corradi Derma: fachada e ambientes, fotos da propria clinica.
    {"nome": "clinica-fachada", "origem": LOTE1 + "WhatsApp Image 2026-10-16 at 10.25.20.jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-noite", "origem": LOTE1 + "WhatsApp Image 2026-10-16 at 10.30.50 (1).jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-lounge", "origem": LOTE2 + "WhatsApp Image 2026-10-16 at 23.53.43.jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-painel-ouro", "origem": LOTE2 + "WhatsApp Image 2026-10-16 at 23.53.50 (1).jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-cafe-health", "origem": CLI + "WhatsApp Image 2026-10-17 at 00.02.19AAA.jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-sala", "origem": CLI + "WhatsApp Image 2026-10-17 at 00.02.18AA.jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-janela", "origem": CLI + "WhatsApp Image 2026-10-17 at 00.09.56.jpeg",
     "larguras": [480, 828, 1200]},

    {"nome": "ig-avatar", "origem": "instagram/perfil.jpg", "larguras": [160]},

    # A sessao, do reel de 2026-09-09 (bigode chines + flacidez).
    {"nome": "sessao-vetores", "origem": POST + "2026-09-09-DdFf_-jhlT0-01.mp4",
     "quadro": 10.6, "larguras": [480, 720]},

    # Clinica: inauguracao (2026-08-18).
    {"nome": "clinica-poltrona", "origem": POST + "2026-08-18-DcMi2gOj30m-01.jpg",
     "larguras": [480, 828, 1080]},
]

VC = "../minha-curadoria/video-clinica.mp4"

VIDEOS = [
    # Tour da clinica (curadoria do Augusto): a paciente usando os aparelhos.
    # Trechos de 3,5 a 4 s, mudos, em loop: funcionam como GIF, pesando menos.
    {"nome": "loop-capacete", "origem": VC, "inicio": 113.5, "fim": 117.0, "largura": 480},
    {"nome": "loop-poltrona", "origem": VC, "inicio": 117.5, "fim": 121.5, "largura": 480},
    {"nome": "loop-analise", "origem": VC, "inicio": 135.0, "fim": 139.0, "largura": 480},
    {"nome": "loop-maquinas", "origem": VC, "inicio": 152.0, "fim": 155.8, "largura": 480},

    # Videos oficiais dos aparelhos (curadoria do Augusto), recortados para ficar
    # so o aparelho: sai o texto de campanha e o trecho da ampola DSB, que e
    # outro protocolo. O VOLFORMER mantem as legendas MPT/Volnewmer de baixo.
    {"nome": "loop-tec-ultraformer", "origem": "../minha-curadoria/ultraformer.mp4",
     "inicio": 0.0, "fim": 4.2, "largura": 480, "recorte": (0.0, 0.04, 1.0, 0.56)},
    {"nome": "loop-tec-volnewmer", "origem": "../minha-curadoria/VOLNEWMER.mp4",
     "inicio": 4.0, "fim": 9.6, "largura": 480, "recorte": (0.0, 0.37, 1.0, 0.91)},
    {"nome": "loop-tec-volformer", "origem": "../minha-curadoria/VOLFORMER.mp4",
     "inicio": 0.0, "fim": 8.0, "largura": 480, "recorte": (0.0, 0.2, 1.0, 0.86)},

    # Sessao filmada pela clinica (Leva 2): a ponteira azul do Ultraformer MPT e
    # a do Volnewmer, com o anel de luz aceso, na mesma paciente do comparativo.
    {"nome": "loop-ultrassom", "origem": LEVA2 + "WhatsApp Video 2026-10-18 at 18.07.28 (1).mp4",
     "inicio": 0.3, "fim": 4.3, "largura": 480},
    {"nome": "loop-radiofrequencia", "origem": LEVA2 + "WhatsApp Video 2026-10-18 at 18.07.35.mp4",
     "inicio": 5.0, "fim": 9.0, "largura": 480},

    # Aquapure (destaque do Instagram): a ponteira de luz azul no rosto, com a
    # camera parada. Recorte 4:5, o formato do cartao em Outros cuidados.
    {"nome": "loop-aquapure", "origem": "instagram/destaques/Aquapure/2026-08-20-01-01.mp4",
     "inicio": 22.0, "fim": 26.4, "largura": 480, "recorte": (0.0, 0.15, 1.0, 0.85)},
]

# Curadoria guardada e FORA da pagina: nao e gerada nem vai no deploy. Para usar
# um item, mova para FOTOS (ou VIDEOS, se tiver inicio/fim) e rode o script.
RESERVA = [
    {"nome": "clinica-entrada", "origem": LOTE1 + "WhatsApp Image 2026-10-16 at 10.25.50.jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-salao", "origem": LOTE2 + "WhatsApp Image 2026-10-16 at 23.53.44 (3).jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-massagem", "origem": CLI + "WhatsApp Image 2026-10-17 at 00.02.18.jpeg",
     "larguras": [480, 828, 1200]},
    {"nome": "clinica-analise", "origem": CLI + "WhatsApp Image 2026-10-17 at 00.02.19AA.jpeg",
     "larguras": [480, 828, 1200]},
    # Retrato de estudio usado na materia do Brasilia Hoje (2026-05-25).
    {"nome": "dra-retrato", "origem": "imprensa/brasilia-hoje-2026-05-25.jpg",
     "larguras": [480, 828, 1200, 1600]},
    # Antes e depois do post de 2026-10-15 (Volformer), separados na linha branca.
    {"nome": "caso-perfil-antes", "origem": POST + "2026-10-15-Deh2QqzDxsk-02.jpg",
     "recorte": (0.0, 0.0, 0.497, 1.0), "larguras": [400, 600]},
    {"nome": "caso-perfil-depois", "origem": POST + "2026-10-15-Deh2QqzDxsk-02.jpg",
     "recorte": (0.503, 0.0, 1.0, 1.0), "larguras": [400, 600]},
    {"nome": "caso-frente-antes", "origem": POST + "2026-10-15-Deh2QqzDxsk-03.jpg",
     "recorte": (0.0, 0.0, 0.497, 1.0), "larguras": [400, 600]},
    {"nome": "caso-frente-depois", "origem": POST + "2026-10-15-Deh2QqzDxsk-03.jpg",
     "recorte": (0.503, 0.0, 1.0, 1.0), "larguras": [400, 600]},
    # Tecnologias combinadas (2026-09-17): quadros "Antes" e "Depois" do reel.
    {"nome": "caso-combinado-antes", "origem": POST + "2026-09-17-DdZxwNihI35-01.mp4",
     "quadro": 8.1, "recorte": (0.0, 0.08, 1.0, 0.70), "larguras": [400, 600]},
    {"nome": "caso-combinado-depois", "origem": POST + "2026-09-17-DdZxwNihI35-01.mp4",
     "quadro": 11.3, "recorte": (0.0, 0.08, 1.0, 0.70), "larguras": [400, 600]},
    # Plano de um ano com Volformer, bioestimuladores e CO2 (2026-07-18).
    {"nome": "caso-plano-antes", "origem": POST + "2026-07-18-Da9BgojNBiu-01.mp4",
     "quadro": 1.2, "recorte": (0.0, 0.12, 1.0, 0.80), "larguras": [400, 600]},
    {"nome": "caso-plano-depois", "origem": POST + "2026-07-18-Da9BgojNBiu-01.mp4",
     "quadro": 3.5, "recorte": (0.0, 0.12, 1.0, 0.80), "larguras": [400, 600]},
    # A sessao, do reel de 2026-09-09.
    {"nome": "sessao-marcacao", "origem": POST + "2026-09-09-DdFf_-jhlT0-01.mp4",
     "quadro": 19.7, "larguras": [480, 720]},
    {"nome": "sessao-ultrassom", "origem": POST + "2026-09-09-DdFf_-jhlT0-01.mp4",
     "quadro": 22.7, "larguras": [480, 720]},
    {"nome": "sessao-radiofrequencia", "origem": POST + "2026-09-09-DdFf_-jhlT0-01.mp4",
     "quadro": 28.8, "larguras": [480, 720]},
    # Tour da clinica (2026-09-09).
    {"nome": "clinica-painel", "origem": POST + "2026-09-09-DdE-iuLJ3Lr-01.mp4",
     "quadro": 6.4, "larguras": [480, 720]},
    {"nome": "clinica-cafe", "origem": POST + "2026-09-09-DdE-iuLJ3Lr-01.mp4",
     "quadro": 11.4, "larguras": [480, 720]},
    {"nome": "clinica-porta", "origem": POST + "2026-09-09-DdE-iuLJ3Lr-01.mp4",
     "quadro": 1.3, "recorte": (0.0, 0.0, 1.0, 0.62), "larguras": [480, 720]},
    # Videos. A mulher do loop-espelho NAO e a Dra. Marina: nao legendar como ela.
    {"nome": "loop-espelho", "origem": VC, "inicio": 146.0, "fim": 149.8, "largura": 480},
    {"nome": "loop-aplicacao", "origem": POST + "2026-09-09-DdFf_-jhlT0-01.mp4",
     "inicio": 18.6, "fim": 30.2, "largura": 540},
    {"nome": "loop-clinica", "origem": POST + "2026-09-09-DdE-iuLJ3Lr-01.mp4",
     "inicio": 5.6, "fim": 15.0, "largura": 540},
]

QUALIDADE_AVIF = 56
QUALIDADE_WEBP = 80


def resolver(fontes: Path, padrao: str) -> Path:
    achados = sorted(glob.glob(str(fontes / padrao)))
    if not achados:
        raise FileNotFoundError(f"fonte nao encontrada: {padrao}")
    return Path(achados[0])


def quadro_de_video(video: Path, segundo: float, destino: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-ss", f"{segundo:.3f}", "-i", str(video),
         "-frames:v", "1", str(destino)],
        check=True,
    )


def recortar(img: Image.Image, recorte) -> Image.Image:
    if not recorte:
        return img
    x0, y0, x1, y1 = recorte
    w, h = img.size
    return img.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))


def salvar_larguras(img: Image.Image, nome: str, larguras: list[int]) -> list[int]:
    feitas = []
    for largura in sorted(set(min(l, img.width) for l in larguras)):
        altura = round(img.height * largura / img.width)
        menor = img if largura == img.width else img.resize((largura, altura), Image.LANCZOS)
        menor.save(SAIDA / f"{nome}-{largura}.avif", "AVIF", quality=QUALIDADE_AVIF)
        menor.save(SAIDA / f"{nome}-{largura}.webp", "WEBP", quality=QUALIDADE_WEBP, method=6)
        feitas.append(largura)
    return feitas


def gerar_foto(item: dict, fontes: Path, tmp: Path) -> dict:
    origem = resolver(fontes, item["origem"])
    if "quadro" in item:
        png = tmp / f"{item['nome']}.png"
        quadro_de_video(origem, item["quadro"], png)
        origem = png
    # "alfa" mantem o fundo transparente (render que flutua sobre a secao escura).
    modo = "RGBA" if item.get("alfa") else "RGB"
    with Image.open(origem) as bruta:
        img = recortar(ImageOps.exif_transpose(bruta).convert(modo), item.get("recorte"))
    larguras = salvar_larguras(img, item["nome"], item["larguras"])
    return {"w": img.width, "h": img.height, "larguras": larguras}


def dimensoes(video: Path) -> tuple[int, int]:
    saida = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height", "-of", "json", str(video)],
        capture_output=True, text=True, check=True,
    )
    s = json.loads(saida.stdout)["streams"][0]
    return s["width"], s["height"]


def gerar_video(item: dict, fontes: Path, tmp: Path) -> dict:
    origem = resolver(fontes, item["origem"])
    destino = SAIDA / f"{item['nome']}.mp4"
    filtros = [f"scale={item['largura']}:-2", "fps=30"]
    if item.get("recorte"):
        # Mesmo formato relativo das fotos: tira texto queimado e logos da borda.
        x0, y0, x1, y1 = item["recorte"]
        filtros.insert(0, f"crop=iw*{x1 - x0:.4f}:ih*{y1 - y0:.4f}:iw*{x0:.4f}:ih*{y0:.4f}")
    # Sem audio (-an): o loop toca mudo e o arquivo fica menor. faststart poe o
    # indice no comeco, para o navegador comecar a tocar antes do fim do download.
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-ss", f"{item['inicio']:.3f}", "-to",
         f"{item['fim']:.3f}", "-i", str(origem), "-an", "-vf", ",".join(filtros),
         "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(destino)],
        check=True,
    )
    # O poster e o primeiro quadro do proprio arquivo final: sem salto visual
    # quando o video comeca.
    png = tmp / f"{item['nome']}-poster.png"
    quadro_de_video(destino, 0, png)
    with Image.open(png) as bruta:
        img = bruta.convert("RGB")
    larguras = salvar_larguras(img, f"{item['nome']}-poster", [img.width])
    w, h = dimensoes(destino)
    kb = destino.stat().st_size // 1024
    print(f"  {destino.name}: {w}x{h}, {kb} KB")
    return {"w": w, "h": h, "larguras": larguras, "video": True}


def ler_indice() -> dict:
    if not INDICE.exists():
        return {}
    texto = INDICE.read_text(encoding="utf-8")
    inicio = texto.index("/*json*/") + len("/*json*/")
    fim = texto.index("/*fim*/")
    return json.loads(texto[inicio:fim])


def escrever_indice(dados: dict) -> None:
    corpo = json.dumps(dict(sorted(dados.items())), ensure_ascii=False, indent=2)
    INDICE.write_text(
        "// Gerado por scripts/midias.py. Nao editar a mao: rode o script.\n"
        "export const MIDIAS = /*json*/" + corpo + "/*fim*/ as const;\n\n"
        "export type NomeMidia = keyof typeof MIDIAS;\n",
        encoding="utf-8",
        newline="\n",  # sem isso, no Windows o arquivo sai com CRLF
    )


def arquivos_do_item(nome: str, dados: dict) -> list[Path]:
    """Os arquivos exatos que um item gerou. Lista fechada, e não um glob por
    prefixo: apagar "clinica-cafe-*" levaria junto o "clinica-cafe-health"."""
    base = f"{nome}-poster" if dados.get("video") else nome
    arquivos = [SAIDA / f"{base}-{l}.{ext}" for l in dados["larguras"] for ext in ("avif", "webp")]
    if dados.get("video"):
        arquivos.append(SAIDA / f"{nome}.mp4")
    return arquivos


def podar(indice: dict) -> None:
    """Tira do índice e de public/media o que saiu das listas FOTOS e VIDEOS."""
    vivos = {item["nome"] for item in FOTOS + VIDEOS}
    for nome in sorted(set(indice) - vivos):
        apagados = 0
        for arquivo in arquivos_do_item(nome, indice.pop(nome)):
            if arquivo.exists():
                arquivo.unlink()
                apagados += 1
        print(f"podado {nome}: {apagados} arquivos")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fontes", default=str(RAIZ.parent / "midia"))
    ap.add_argument("--forcar", action="store_true")
    ap.add_argument("--so", action="append", default=[])
    ap.add_argument("--podar", action="store_true", help="apaga os itens que saíram das listas")
    a = ap.parse_args()

    fontes = Path(a.fontes)
    SAIDA.mkdir(parents=True, exist_ok=True)
    indice = ler_indice()
    if a.podar:
        podar(indice)

    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        for item in FOTOS + VIDEOS:
            nome = item["nome"]
            if a.so and nome not in a.so:
                continue
            if nome in indice and not a.forcar and not a.so:
                continue
            gerar = gerar_video if item.get("tipo") == "video" or item in VIDEOS else gerar_foto
            try:
                indice[nome] = gerar(item, fontes, tmp)
                print(f"ok {nome}: {indice[nome]['w']}x{indice[nome]['h']}")
            except (FileNotFoundError, subprocess.CalledProcessError) as erro:
                print(f"FALHOU {nome}: {erro}")

    escrever_indice(indice)
    print(f"indice: {INDICE.relative_to(RAIZ)} ({len(indice)} itens)")


if __name__ == "__main__":
    main()
