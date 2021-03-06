# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2019-03-23 12:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0011_auto_20170423_1048'),
    ]

    operations = [
        migrations.CreateModel(
            name='Shift',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True, verbose_name='Titre')),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
            ],
            options={
                'ordering': ('name',),
                'db_table': 'shift',
                'verbose_name': 'tranche horaire',
                'verbose_name_plural': 'tranches horaires',
            },
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_animajoueur',
        ),
        migrations.AddField(
            model_name='user',
            name='shifts',
            field=models.ManyToManyField(blank=True, related_name='animajoueurs', to='games.Shift', verbose_name='Planning'),
        ),
    ]
