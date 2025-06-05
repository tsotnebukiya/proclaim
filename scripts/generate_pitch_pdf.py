#!/usr/bin/env python3
from textwrap import dedent

# Simple PDF generator without external dependencies
# Generates a PDF pitch deck for the proClaim project

def escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

def make_pdf(pages, out_path="INVESTOR_PITCH.pdf"):
    header = "%PDF-1.4\n"
    objects = []
    kids = []
    obj_num = 1

    def add(obj_str):
        nonlocal obj_num
        objects.append((obj_num, obj_str))
        obj_num += 1
        return obj_num - 1

    # Catalog placeholder (object 1)
    add("<< /Type /Catalog /Pages 2 0 R >>")
    # Pages object will be object 2
    pages_obj_num = add("")  # placeholder, to be replaced later

    content_obj_nums = []
    page_obj_nums = []

    for page_text in pages:
        lines = page_text.strip().split("\n")
        stream_lines = ["BT", "/F1 18 Tf"]
        y = 740
        for line in lines:
            stream_lines.append(f"1 0 0 1 72 {y} Tm ({escape(line)}) Tj")
            y -= 24
        stream_lines.append("ET")
        content = "\n".join(stream_lines)
        content_obj = f"<< /Length {len(content)} >>\nstream\n{content}\nendstream"
        cnum = add(content_obj)
        content_obj_nums.append(cnum)
        page_obj = f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents {cnum} 0 R /Resources << /Font << /F1 3 0 R >> >> >>"
        pnum = add(page_obj)
        page_obj_nums.append(pnum)
        kids.append(f"{pnum} 0 R")

    # Font object (object after pages and contents)
    add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    # Update pages object with kids
    pages_obj_idx = 1  # second object
    kids_str = "[" + " ".join(kids) + "]"
    pages_obj = f"<< /Type /Pages /Kids {kids_str} /Count {len(kids)} >>"
    objects[pages_obj_idx] = (2, pages_obj)

    # Build PDF body and calculate offsets
    pdf = header
    offsets = []
    for num, obj in objects:
        offsets.append(len(pdf))
        pdf += f"{num} 0 obj\n{obj}\nendobj\n"

    startxref = len(pdf)
    xref = f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n"
    for off in offsets:
        xref += f"{off:010} 00000 n \n"
    trailer = f"trailer\n<< /Root 1 0 R /Size {len(objects)+1} >>\nstartxref\n{startxref}\n%%EOF"
    pdf += xref + trailer

    with open(out_path, "wb") as f:
        f.write(pdf.encode("latin1"))

if __name__ == "__main__":
    pages = [
        "proClaim Investor Pitch",
        dedent(
            """
            Project Overview:
            - Next.js 14 app with tRPC and Prisma
            - Blockchain utilities in packages/proclaim
            - Cron jobs sync on-chain state
            """
        ).strip(),
        dedent(
            """
            Updated Investor Plan:
            1. Switch to a dedicated backend service
            2. Redesign and audit blockchain contracts
            3. Harden infrastructure and run end-to-end tests
            """
        ).strip(),
        dedent(
            """
            Team & Timeline:
            - Lead engineer/architect
            - Backend engineers (2)
            - Frontend developer
            - Blockchain engineer
            - DevOps and QA
            - 6-8 month effort
            """
        ).strip(),
        dedent(
            """
            Cost Estimate (Warsaw):
            - Average 25-30k PLN per person per month
            - 7-8 people for eight months
            - Approximately 1.6-1.9M PLN (400k-470k USD)
            """
        ).strip(),
    ]
    make_pdf(pages)
