# usage:
# make all MATCH="opendata|transparency"
# map, geo, carto, spatial

fetch: 
	cd ./action_plan_src && sh -c "node ../action-plans.js | xargs -I {} curl {} -sO"

extract:
	rm -rf action_plan_txt
	mkdir action_plan_txt

	rm -rf action_plan_work
	mkdir action_plan_work

	# pdfs
	cp ./action_plan_src/*.pdf ./action_plan_work
	find ./action_plan_work | grep -i pdf | xargs -I {} basename -s.pdf {} | xargs -t -I {} pdftotext -q -layout ./action_plan_src/{}.pdf ./action_plan_txt/{}.txt
	rm -f ./action_plan_work/*

	# docs
	cp ./action_plan_src/*.doc ./action_plan_work
	find ./action_plan_work | grep -i doc | grep -v \.docx | xargs -I {} basename -s.doc {} | xargs -t -I {} sh -c "antiword ./action_plan_src/{}.doc > ./action_plan_txt/{}.txt"
	rm -f ./action_plan_work/*

	# # docx
	cp ./action_plan_src/*.docx ./action_plan_work
	find ./action_plan_work | grep -i docx | xargs -I {} basename -s.docx {} | xargs -I {} sh -c "pandoc ./action_plan_src/{}.docx > ./action_plan_txt/{}.txt"
	rm -f ./action_plan_work/*

	rmdir action_plan_work

search:
	# find matches, copy files to ./matches directory
	grep -il -E "$(MATCH)" ./action_plan_txt/* | xargs -I {} basename -s.txt {} | xargs -t -I {} sh -c "cp ./action_plan_src/{}.* ./matches/"

	echo "" && echo "*** Complete! Have a look in the matches directory for matching files."

all: fetch extract search

newsearch:
	rm -f matches/*

clean:
	rm -f action_plan_src/*
	rm -f matches/*
	rm -rf action_plan_txt
	rm -f .loaded