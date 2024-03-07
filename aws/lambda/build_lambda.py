import os
import zipfile

def create_zip_archive(output_path, source_dirs, source_files):
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in source_files:
            zipf.write(file, os.path.basename(file))
        for source_dir in source_dirs:
            for foldername, subfolders, filenames in os.walk(source_dir):
                for filename in filenames:
                    file_path = os.path.join(foldername, filename)
                    zipf.write(file_path, os.path.relpath(file_path, source_dir))

create_zip_archive(
    'lambda_function.zip',
    source_dirs=['venv/lib/python3.8/site-packages'], 
    source_files=['lambda_function.py']
)
