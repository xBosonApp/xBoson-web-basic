@echo off

set CURR_DIR=%~dp0
set FABRIC_ROOT=d:\BlockChain\fabric\server
set FABRIC_CFG_PATH=d:\BlockChain\fabric\config
set PATH=%PATH%;%FABRIC_ROOT%
set CORE_PEER_LOCALMSPID=Org1MSP
set CORE_PEER_MSPCONFIGPATH=%FABRIC_CFG_PATH%\crypto-config\peerOrganizations\org1.example.com\peers\peer0.org1.example.com\msp

