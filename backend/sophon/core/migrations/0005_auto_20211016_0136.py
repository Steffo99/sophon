# Generated by Django 3.2.7 on 2021-10-16 01:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0004_sophoninstancedetails'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sophoninstancedetails',
            options={'verbose_name': 'Sophon instance details', 'verbose_name_plural': 'Sophon instance details'},
        ),
        migrations.AlterField(
            model_name='sophoninstancedetails',
            name='theme',
            field=models.CharField(
                choices=[('sophon', 'The Sophonity'), ('paper', 'Sheet of Paper'), ('royalblue', 'Royal Blue'), ('hacker', 'Hacker Terminal'),
                         ('amber', 'Gestione Amber')], default='sophon', help_text='The bluelib theme of the Sophon instance.', max_length=32,
                verbose_name='Theme'),
        ),
    ]
