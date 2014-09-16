# edit the following line to search for something else
MATCH_TEXT=geo|cartogr

fetch: 
	cd ./action_plan_src && sh -c "node ../action-plans.js | xargs -I {} curl {} -sO"

match:
	rm -rf action_plan_txt
	mkdir action_plan_txt

	# pdfs
	find ./action_plan_src | grep \.pdf | xargs -I {} basename -s.pdf {} | xargs -t -I {} pdftotext -q -layout ./action_plan_src/{}.pdf ./action_plan_txt/{}.txt
	grep -il -E "$(MATCH_TEXT)" ./action_plan_txt/* | xargs -I {} basename -s.txt {} | xargs -t -I {} sh -c "cp ./action_plan_src/{}.pdf ./action_plan_hits/"
	rm -f ./action_plan_txt/*

	# docs
	find ./action_plan_src | grep \.doc | grep -v \.docx | xargs -I {} basename -s.doc {} | xargs -t -I {} sh -c "antiword ./action_plan_src/{}.doc > ./action_plan_txt/{}.txt"
	grep -il -E "$(MATCH_TEXT)" ./action_plan_txt/* | xargs -I {} basename -s.txt {} | xargs -t -I {} cp ./action_plan_src/{}.doc ./action_plan_hits/
	rm -f ./action_plan_txt/*

	# docx
	find ./action_plan_src | grep \.docx | xargs -I {} basename -s.docx {} | xargs -I {} sh -c "pandoc ./action_plan_src/{}.docx > ./action_plan_txt/{}.txt"
	grep -il -E "$(MATCH_TEXT)" ./action_plan_txt/* | xargs -I {} basename -s.txt {} | xargs -t -I {} cp ./action_plan_src/{}.docx ./action_plan_hits/
	rm -f ./action_plan_txt/*

	rmdir action_plan_txt

	echo "" && echo "*** Complete! Have a look in the action_plan_hits directory for matching files."

clean:
	rm -f action_plan_src/*
	rm -f action_plan_hits/*
	rm -rf action_plan_txt
	rm -f .loaded