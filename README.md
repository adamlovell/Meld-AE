# Meld-AE
Starting out

Open test.aep. The project folder called Direction-EN_US is an example buildout. Delete this folder before moving on to Step 2.
In AE nav to ”File” - ”Scripts” - “Run Script File…”
Select “_Meld/ae-scripts/meld.jsx”
Choose desired “ads” JSON from the file dialog 
???
Profit

Once the script is first run, you may run it again with shortcut shift+opt-cmd+d

If you re-run the script, remember to delete the generated ads folder in your project (NOT the _assets!). This step will be removed when update functionality is added.

Adding Creative

The _assets folder contains Ref Comps that can be animated and styled with campaign creative. Inside each is a textRefStyle text layer that can be styled and have text animators applied to it. This layer is auto-sized and cannot be Transformed on the timeline. 

textRefArea layer determines the size and position of the text. Please remember to resize, not scale refAreas. This layer should not be animated. For standard animation with the text we want to use the ANIMATOR.

ANIMATOR layer is 3D and allows all the standard properties to be animated such as 3D position and scale.


Advanced Text Animation

For complex animation involving multiple text fields or things the default text setup can’t accomplish, there are a couple of options:

1. You can implement your own custom-made text fields and use textRefStyle as a pilot, Pickwhipping the Source Text of myCrazyCustomTextField to textRefStyle, along with any other properties such as position, scale etc that you would need to accomplish the necessary autosizing and positioning of myCrazyCustomTextField. After that textRefStyle can be hidden, or animated with ANIMATOR and text animators in concert with supporting text fields.

2. Put in a feature request in Asana and we can coordinate a solution. 






Feature Requests & Creative Challenges

Feel free to run ideas by me as I may be able to provide an easy / long-term programmatic solution for the creative you are looking to execute.

Feature requests will be added to Asana on the Dynamic Video Tool Development project in the subtasks.. You can track the priority level of your feature requests there. Be sure to hit me up in the case of any priority needs or shifts and we can look to resolve it ASAP. 


Thanks for reading! More to come.
