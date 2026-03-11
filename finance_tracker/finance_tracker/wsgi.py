"""
WSGI config for finance_tracker project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path

from django.core.wsgi import get_wsgi_application

# Add the parent directory (finance_tracker folder) to sys.path
# This ensures 'finance_tracker.settings' can be found when running from the root
sys.path.append(str(Path(__file__).resolve().parent.parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_tracker.settings')

application = get_wsgi_application()
app = application