# Generated by Django 3.2.7 on 2021-10-19 17:45

from django.db import migrations, models

import sophon.notebooks.validators


class Migration(migrations.Migration):
    dependencies = [
        ('notebooks', '0010_auto_20211019_1738'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notebook',
            name='container_image',
            field=models.CharField(choices=[('steffo45/jupyterlab-docker-sophon', 'Python (Sophonic)')], default='steffo45/jupyterlab-docker-sophon',
                                   help_text='The Docker image to run for this notebook.', max_length=256, verbose_name='Docker image'),
        ),
        migrations.AlterField(
            model_name='notebook',
            name='slug',
            field=models.SlugField(
                help_text='Unique alphanumeric string which identifies the project. Changing this once the container has been created <strong>will break Docker</strong>!',
                max_length=64, primary_key=True, serialize=False,
                validators=[sophon.notebooks.validators.DisallowedValuesValidator(['api', 'static', 'proxy', 'backend', 'frontend', 'src'])],
                verbose_name='Slug'),
        ),
    ]
