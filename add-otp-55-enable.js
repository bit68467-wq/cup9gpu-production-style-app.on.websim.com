@@ Line 1 (prev 1) @@
 /*
- enable-otp-55-true.js — operator action: arm and enable OTP generation for 55@55 at startup
+ enable-otp-55-true.js — operator action overridden: disable OTP generation for 55@55 at startup
 */
 (function(){
   try{
     const email = '55@55';
     const norm = String(email).toLowerCase();
     const depositoKey = `otp_${norm}_deposito`;
-    const prelievoKey = `otp_${norm}_prelievo`;
+    const preKey = `otp_${norm}_prelievo`;
     const enabledKey = 'CUP9_OTP_BUTTON_ENABLED_FOR_' + norm;
     const permKey = 'CUP9_OTP_BUTTON_PERM_DISABLED_FOR_' + norm;
-    const cmd = `tasto otp true, valido per utente (${email})`;
+    const cmd = `tasto otp false, non valido per depositi e prelievi per utente (${email})`;
 
-    // set per-type keys to 'armed' and clear perm-disabled marker
-    try{ localStorage.setItem(depositoKey, 'armed'); }catch(e){}
-    try{ localStorage.setItem(prelievoKey, 'armed'); }catch(e){}
-    try{ localStorage.setItem(enabledKey, 'true'); }catch(e){}
-    try{ localStorage.removeItem(permKey); }catch(e){}
-    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_deposito', 'true'); }catch(e){}
-    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_prelievo', 'true'); }catch(e){}
+    // Set both deposit and prelievo keys to 'false' and set persistent operator disable marker
+    try{ localStorage.setItem(depositoKey, 'false'); }catch(e){}
+    try{ localStorage.setItem(preKey, 'false'); }catch(e){}
+    try{ localStorage.setItem(enabledKey, 'false'); }catch(e){}
+    try{ localStorage.setItem(permKey, '1'); }catch(e){}
+    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_deposito', 'false'); }catch(e){}
+    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_' + norm + '_prelievo', 'false'); }catch(e){}
 
-    // Prefer centralized handler if present
+    // Prefer centralized handler if available (inform it of the disable command)
     if(window.CUP9 && typeof window.CUP9.handleOtpCommand === 'function'){
-      try{ window.CUP9.handleOtpCommand(cmd); }catch(e){}
+      try{ window.CUP9.handleOtpCommand(cmd); }catch(e){ console.warn('handleOtpCommand call failed', e); }
     }
 
-    // Broadcast a storage ping so other tabs refresh their UI
+    // Broadcast command ping so other tabs update via storage event handlers
     try{ localStorage.setItem('CUP9_OTP_COMMAND', cmd); localStorage.removeItem('CUP9_OTP_COMMAND'); }catch(e){}
-    try{ localStorage.setItem('CUP9_OTP_BUTTON_ENABLED_FOR_UPDATED', JSON.stringify({ email: norm, enabled: true, ts: Date.now() })); }catch(e){}
+
+    // Notify in-page listeners if available
     try{ if(typeof notify === 'function') notify('ui:force-refresh'); }catch(e){}
 
-    console.info('enable-otp-55-true: OTP ARMED/ENABLED for', email);
+    console.info('enable-otp-55-true (overridden): OTP depositi+prelievi DISABLED for', email);
   }catch(err){
-    console.error('enable-otp-55-true bootstrap failed', err);
+    console.error('enable-otp-55-true (override) bootstrap failed', err);
   }
 })();

index.html
@@ Line 86 (prev 86) @@
   <script type="module" src="./hardware-price-summary.js"></script>
   <!-- Ensure OTP disabled for 55@55: load definitive disable script last so it wins over earlier enables -->
   <script type="module" src="./add-otp-55-disable.js"></script>
+  <script type="module" src="./add-otp-55-manual-disable.js"></script>
 </body>
 </html>
