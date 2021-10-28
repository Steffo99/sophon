import django.contrib.admin.apps


class SophonAdminConfig(django.contrib.admin.apps.AdminConfig):
    """
    Customized administration site config.
    """
    default_site = "sophon.admin.SophonAdminSite"


class SophonAdminSite(django.contrib.admin.AdminSite):
    """
    Customized administration site.
    """

    site_header = "Sophon Server Administration"
    site_title = "Sophon Server Administration"
    site_url = None

    index_title = "Resources Administration"
