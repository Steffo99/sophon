# Generated by Django 3.2.7 on 2021-09-20 15:35

from django.db import migrations, models


def create_instance_details(apps, schema_editor):
    db = schema_editor.connection.alias
    # noinspection PyPep8Naming
    SophonInstanceDetails = apps.get_model("core", "SophonInstanceDetails")
    SophonInstanceDetails.objects.create()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20210901_1529'),
    ]

    operations = [
        migrations.CreateModel(
            name='SophonInstanceDetails',
            fields=[
                ('id', models.IntegerField(choices=[(1, 'This')], default=1, primary_key=True, serialize=False, verbose_name='Instance details ID')),
                ('name', models.CharField(default='Sophon', help_text='The name of this Sophon instance.', max_length=128, verbose_name='Instance name')),
                ('description', models.TextField(blank=True, help_text='A description of this Sophon instance, to be displayed on its home page.', null=True, verbose_name='Description')),
                ('theme', models.CharField(choices=[('sophon', 'The Sophonity'), ('paper', 'Sheet of Paper'), ('royalblue', 'Royal Blue'), ('hacker', 'Hacker Terminal')], default='sophon', help_text='The bluelib theme of the Sophon instance.', max_length=32, verbose_name='Theme')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RunPython(create_instance_details),
    ]
