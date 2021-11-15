exports.generateConfirmEmailHtml = (email, activationKey, secret_email) => {
  return `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <title>
          
        </title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a { padding:0; }
          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
          p { display:block;margin:13px 0; }
        </style>
        <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if lte mso 11]>
        <style type="text/css">
          .outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
        
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);
        </style>
      <!--<![endif]-->

    
        
    <style type="text/css">
      @media only screen and (max-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>
    
  
        <style type="text/css">
        
        
        </style>
        <style type="text/css">.hide_on_mobile { display: none !important;} 
        @media only screen and (min-width: 480px) { .hide_on_mobile { display: block !important;} }
        .hide_section_on_mobile { display: none !important;} 
        @media only screen and (min-width: 480px) { 
            .hide_section_on_mobile { 
                display: table !important;
            } 

            div.hide_section_on_mobile { 
                display: block !important;
            }
        }
        .hide_on_desktop { display: block !important;} 
        @media only screen and (min-width: 480px) { .hide_on_desktop { display: none !important;} }
        .hide_section_on_desktop { 
            display: table !important;
            width: 100%;
        } 
        @media only screen and (min-width: 480px) { .hide_section_on_desktop { display: none !important;} }
        
          p, h1, h2, h3 {
              margin: 0px;
          }

          a {
              text-decoration: none;
              color: inherit;
          }

          @media only screen and (max-width:480px) {

            .mj-column-per-100 { width:100%!important; max-width:100%!important; }
            .mj-column-per-100 > .mj-column-per-75 { width:75%!important; max-width:75%!important; }
            .mj-column-per-100 > .mj-column-per-60 { width:60%!important; max-width:60%!important; }
            .mj-column-per-100 > .mj-column-per-50 { width:50%!important; max-width:50%!important; }
            .mj-column-per-100 > .mj-column-per-40 { width:40%!important; max-width:40%!important; }
            .mj-column-per-100 > .mj-column-per-33 { width:33.333333%!important; max-width:33.333333%!important; }
            .mj-column-per-100 > .mj-column-per-25 { width:25%!important; max-width:25%!important; }

            .mj-column-per-100 { width:100%!important; max-width:100%!important; }
            .mj-column-per-75 { width:100%!important; max-width:100%!important; }
            .mj-column-per-60 { width:100%!important; max-width:100%!important; }
            .mj-column-per-50 { width:100%!important; max-width:100%!important; }
            .mj-column-per-40 { width:100%!important; max-width:100%!important; }
            .mj-column-per-33 { width:100%!important; max-width:100%!important; }
            .mj-column-per-25 { width:100%!important; max-width:100%!important; }
        }</style>
        
      </head>
      <body style="background-color:#FFFFFF;">
        
        
      <div style="background-color:#FFFFFF;">
        
      
      <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    
      
      <div style="background:#E0F1FF;background-color:#E0F1FF;margin:0px auto;max-width:600px;">
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#E0F1FF;background-color:#E0F1FF;width:100%;">
          <tbody>
            <tr>
              <td style="border:none;direction:ltr;font-size:0px;padding:14px 0px 14px 0px;text-align:center;">
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
            
      <div class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        
            <tbody><tr>
              <td align="left" style="font-size:0px;padding:0px 15px 0px 30px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: #000000; font-size: 36px; font-family: Georgia, sans-serif;">ScheduleMessages.com</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 7px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial; text-align: center;"><span style="color: #000000; font-family: Arial, sans-serif; font-size: 20px;">Welcome <span style="text-decoration: underline;"><span style="color: #000000; text-decoration: underline;">${email}</span></span></span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:0px 15px 12px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial; text-align: center;"><span style="font-size: 17px; font-family: Arial, sans-serif;">Your activation key: <span style="text-decoration: underline;">${activationKey}</span></span><br><strong><span style="font-size: 17px; font-family: Arial, sans-serif;">valid only 48 hours</span></strong><br><span style="font-size: 17px; font-family: Arial, sans-serif;">Enter the activation key on <span style="text-decoration: underline;"><span style="color: #000000; text-decoration: underline;"><a style="color: #000000; text-decoration: underline;" href="https://scheduleMessages.com/confirm_email">ScheduleMessages.com/confirm_email</a></span></span></span><br><span style="font-size: 17px; font-family: Arial, sans-serif;">or click the address below</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:0px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial; text-align: center;"><span style="text-decoration: underline; font-family: Arial, sans-serif; color: #000000; font-size: 15px;"><a style="color: #000000; text-decoration: underline;" href="https://schedulemessages.com/confirm_email?secret_email=${secret_email}&activationkey=${activationKey}">https://schedulemessages.com/confirm_email?secret_email=${secret_email}&activationkey=${activationKey}</a></span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;word-break:break-word;">
                
      
    <!--[if mso | IE]>
    
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="50" style="vertical-align:top;height:50px;">
      
    <![endif]-->
  
      <div style="height:50px;">
        &nbsp;
      </div>
      
    <!--[if mso | IE]>
    
        </td></tr></table>
      
    <![endif]-->
  
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 10px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.2;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial; text-align: center;"><span style="font-family: Arial, sans-serif; font-size: 13px;">If you have NOT registered on our website no action is required,</span><br><span style="font-family: Arial, sans-serif; font-size: 13px;">your email will be deleted from our database in 48 hours.</span></p></div>
    
              </td>
            </tr>
          
      </tbody></table>
    
      </div>
    
          <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    
    
      </div>
    
      
    </body>
    </html>`;
};
