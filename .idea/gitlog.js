// git log --pretty=format:'{%n  "commit": "%H",%n  "author": "%an <%ae>",%n  "date": "%ad",%n  "message": "%f"%n
// },' $@ | perl -pe 'BEGIN{print "["}; END{print "]\n"}' | perl -pe 's/},]/}]/' > ./.idea/_tmp/gitlogg.tmp


git log --pretty=format:'{%n  "commit": "%H",%n  "author": "%cn",%n  "date": "%cd",%n  "message": "%f"%n
},' $@ | perl -pe 'BEGIN{print "["}; END{print "]\n"}' | perl -pe 's/},]/}]/' > ./.idea/_tmp/gitlogg.tmp
