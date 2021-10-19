# Generated by Django 3.2.7 on 2021-10-19 17:38

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('notebooks', '0009_alter_notebook_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notebook',
            name='internet_access',
        ),
        migrations.AddField(
            model_name='notebook',
            name='internal_url',
            field=models.IntegerField(blank=True,
                                      help_text='The URL reachable from the proxy where the container is available. Can be null if the notebook is not running.',
                                      null=True, verbose_name='Internal URL'),
        ),
        migrations.AlterField(
            model_name='notebook',
            name='port',
            field=models.IntegerField(blank=True,
                                      help_text='The port number of the local machine at which the container is available. Can be null if the notebook is not running, or if the proxy itself is running in a Docker container.',
                                      null=True, verbose_name='Local port number'),
        ),
    ]
