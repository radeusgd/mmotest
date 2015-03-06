#!/bin/bash
ip="$(curl -s icanhazip.com)"
echo "Game: http://$ip:3000/"
echo "Tiles: http://$ip:3000/tileIds.png"
