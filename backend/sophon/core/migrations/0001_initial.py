# Generated by Django 3.2 on 2021-08-10 21:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ResearchGroup',
            fields=[
                ('slug', models.SlugField(help_text='Unique alphanumeric string which identifies the group in the Sophon instance.', max_length=64, primary_key=True, serialize=False, verbose_name='Slug')),
                ('name', models.CharField(help_text='The displayed name of the group.', max_length=512, verbose_name='Name')),
                ('description', models.TextField(blank=True, help_text='A brief description of what the group is about.', verbose_name='Description')),
                ('access', models.CharField(choices=[('MANUAL', '⛔️ Collaborators must be added manually'), ('OPEN', '❇️ Users can join the group freely')], default='MANUAL', help_text='A setting specifying how users can join the group.', max_length=16, verbose_name='Access')),
                ('members', models.ManyToManyField(blank=True, help_text='The users who belong to this group.', related_name='is_a_member_of', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(help_text='The user who created the group, who is automatically a member.', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Research Group',
                'verbose_name_plural': 'Research Groups',
            },
        ),
    ]