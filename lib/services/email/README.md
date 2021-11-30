## Request example

```
services.emailService.send({
  params: {
    toEmail: 'dest@gmail.com',
    toName: 'Daniel',
    subject: 'Common Ninja Test',
    replyTo: 'test@email.com',
    message: 'hey there me!',
  },
  serviceName: 'Common Ninja',
  emailType: EmailType.OTHER,
  service: globals.ServiceName.COMMONNINJA,
}).then(res => console.log('result', res)).catch(e => console.error('failed', e));
```