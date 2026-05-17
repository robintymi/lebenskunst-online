#!/bin/sh
set -e

# Write msmtp config using Resend SMTP
printf 'defaults\ntls on\ntls_starttls off\n\naccount default\nhost smtp.resend.com\nport 465\nauth on\nuser resend\npassword %s\nfrom noreply@lebenskunstonline.de\nlogfile /tmp/msmtp.log\n' "$RESEND_API_KEY" > /etc/msmtprc
chmod 644 /etc/msmtprc

exec "$@"
