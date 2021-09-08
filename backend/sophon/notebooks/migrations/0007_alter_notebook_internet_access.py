# Generated by Django 3.2 on 2021-09-08 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notebooks', '0006_auto_20210908_1554'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notebook',
            name='internet_access',
            field=models.BooleanField(default=True, help_text='If true, the notebook will be able to access the Internet as the host machine. Can only be set by a superuser via the admin interface. <em>Does not currently do anything.</em>', verbose_name='Allow internet access'),
        ),
    ]
