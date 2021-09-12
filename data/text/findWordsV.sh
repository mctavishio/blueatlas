#!/bin/bash
for n in {1..5}
do
   echo "$n"
   sed 's/\.//g;s/\(.*\)/\1/;s/\ /\n/g' artistself.txt | sort | grep '^[0-9A-Za-z()*&:.!|,--/]\{0,8\}$' | uniq -ic  | sort -rn >> outputArtistSelf.txt
done