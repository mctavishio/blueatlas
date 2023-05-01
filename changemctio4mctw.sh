grep -rl 'mctavish.io' . --exclude-dir=.git --include \*.html | LC_ALL=C xargs sed -i '' 's/mctavish.io/mctavish.work/g'
