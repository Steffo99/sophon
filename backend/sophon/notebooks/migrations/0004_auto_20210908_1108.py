# Generated by Django 3.2 on 2021-09-08 11:08

from django.db import migrations, models
import sophon.notebooks.jupyter


class Migration(migrations.Migration):

    dependencies = [
        ('notebooks', '0003_auto_20210905_0348'),
    ]

    operations = [
        migrations.AddField(
            model_name='notebook',
            name='internet_access',
            field=models.BooleanField(default=False, help_text='If true, the notebook will be able to access the Internet as the host machine. Can only be set by a superuser via the admin interface.', verbose_name='Allow internet access'),
        ),
        migrations.AlterField(
            model_name='notebook',
            name='jupyter_token',
            field=models.CharField(default=sophon.notebooks.jupyter.generate_secure_token, help_text='The token to allow access to the JupyterLab editor.', max_length=64, verbose_name='Jupyter Access Token'),
        ),
        migrations.AlterField(
            model_name='notebook',
            name='slug',
            field=models.SlugField(help_text='Unique alphanumeric string which identifies the project. Changing this <strong>WILL BREAK THINGS</strong>!', max_length=64, primary_key=True, serialize=False, verbose_name='Slug'),
        ),
    ]
