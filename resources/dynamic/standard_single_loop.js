/* standard_single_loop.js */
{% 
Dim i 
Dim j
Dim inputName
Dim ar = CurrentQuestion.ParentLoop.AvailableResponses
Dim avR = CurrentQuestion.AvailableResponses
Dim allValues = avR[1].inputValue()

For j = 2 to avR.Count
	allValues = allValues + "," + avR[j].inputValue()
Next

For i = 1 To ar.Count 
	inputName = CurrentQuestion.Iteration(ar[i].Index).InputName()
	%}
//{element : $('#{%= inputName%}'), value :  avR[i].inputValue(), allValues : "{%= allValues%}", caption : "{%= ar[i].Caption %}"}{%= On(i < ar.Count, ",", "") %}
{element : $('#{%= inputName%}'), value : 0, allValues : "{%= allValues%}", caption : "{%= ar[i].Caption %}"}{%= On(i < ar.Count, ",", "") %}
{% Next %}