#!/bin/sh

checkRequiredVariables(){
	exit_code=0
	if [ -z "${ANDROID_HOME}" ]; then
	    echo "ANDROID_HOME is unset or set to the empty string" 
	    exit_code=1
	fi
	if [ -z "${GRADLE_HOME}" ]; then
	    echo "GRADLE_HOME is unset or set to the empty string"
	    exit_code=2
	fi
	which zipalign >/dev/null
	if [ "$?" != "0" ]; then
	    echo "zipalign is not in you PATH. Try to add ANDROID_HOME/build-tools/26.0.2 on PATH"
	    exit_code=3
	fi
	which gradle >/dev/null
	if [ "$?" != "0" ]; then
	    echo "gradle is not in you PATH. Try to add GRADLE_HOME/bin on PATH"
	    exit_code=4
	fi
	which cordova >/dev/null
	if [ "$?" != "0" ]; then
	    echo "cordova is not in you PATH. Try to install with sudo npm install -g cordova"
	    exit_code=5
	fi
	which npm >/dev/null
	if [ "$?" != "0" ]; then
	    echo "npm is not in you PATH. Try to install with sudo apt install npm"
	    exit_code=6
	fi
	return $exit_code
}

buildAndSignAPK(){

# credenciais
STORE_ALIAS=android
STORE_PASS=password

KEY_STORE=android.keystore
KEY_PASS=$STORE_PASS

APK_UNSIGNED=platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
APK_SIGNED=platforms/android/app/build/outputs/apk/release/app-release-signed.apk
DNAME="CN=Polygon, OU=Application Development, O=br.polygon4games.senac.cademinhasala, L=Sao_Paulo, S=Sao_Paulo, C=BR"
# DNAME="CN=BR"

# pasta de fontes
# cd src/

# add android
cordova platform add android

# clean
cordova clean android

# para threejs com webgl
# cordova plugin add cordova-plugin-crosswalk-webview

# android
cordova platform add android

# para gerar a versão release
cordova build android --release

# remove anterior
# rm $KEY_STORE

# gerar chave
keytool -v \
-genkey \
-keystore $KEY_STORE \
-alias $STORE_ALIAS \
-keyalg RSA \
-keysize 2048 \
-validity 10000 \
-dname "$DNAME"<<EOF
$STORE_PASS
$STORE_PASS
$STORE_PASS
$STORE_PASS
EOF

# assinando apk
jarsigner -verbose \
-certs \
-keystore $KEY_STORE \
-storepass $STORE_PASS \
-keypass $KEY_PASS \
$APK_UNSIGNED \
$STORE_ALIAS

# verificando assinatura no jar
jarsigner -verify \
-verbose \
-certs \
$APK_UNSIGNED

rm $APK_SIGNED

zipalign -v 4 \
$APK_UNSIGNED \
$APK_SIGNED

echo "SIGNED FILE: $APK_SIGNED"

# Hash com a assinatura
keytool -printcert -jarfile "$APK_SIGNED"

}


checkRequiredVariables
if [ "$?" = "0" ]; then
	buildAndSignAPK
else
	echo "Some required variabled is unset"
fi