import json
import matplotlib.pyplot as plt
import numpy as np

colors = ['red', 'blue', 'green', 'cyan', 'yellow', 'purple', 'orange', 'magenta', 'lime', 'teal', 'brown', 'navy', 'maroon', 'olive', 'silver', 'aqua']
lastUsedColorIndex = 0
tickwidth=2
barWidth = 0.5
sessionId = "bab0b2bd-d033-4ce2-83f7-c2927643a0a7"
applicationName = "Application Name Comes here"
def extractLabels(data):
    labels = []
    #data.sort(key=lambda x: (x['networkSpeedList']))
    for dataItem in data["networkSpeedList"]:
        thro = str(dataItem)
        labels.append(thro)
    return labels

       
def plot_values(plt,valueList,labelValueSuffix,valueTextFactor=0):
    global lastUsedColorIndex
    xLevelTextConstant = -5
    counter = 0
    tmp = []
    for key, value in valueList.items():
        labelValue = key+"-"+labelValueSuffix
        colorValue = colors[lastUsedColorIndex]
        lastUsedColorIndex = lastUsedColorIndex + 1
        tmp = np.arange(len(value))
        if counter == 0:
            br = [(round(x*tickwidth,1)) for x in tmp]
        else:
            br = [round(x*tickwidth,1)+(counter*barWidth) for x in tmp]
    
        # Update: Add values on the bars, only for interactive
        for i in range(len(value)):
            plt.text(br[i], value[i] + (xLevelTextConstant*valueTextFactor), str(value[i]), ha='center', va='bottom',color=colorValue)
    
        
        #plt.bar(br, value, color =colorValue, width = barWidth, edgecolor ='grey', label =key)
        plt.plot(br, value, color=colorValue, label=labelValue)
        #plt.scatter(br, value, color=colorValue, label=labelValue)
        counter+=1

with open('./reports/'+applicationName+'/chartdata/'+sessionId+'_cpuSlowDownMultiplierImpact.json', 'r') as f:
    reportData = json.load(f)

labels = extractLabels(reportData)
print(labels)

plt.suptitle('Lighthouse - '+applicationName+' \nDuration Times across different Throttled Network Speeds and CPU Slowdown Multiplier ', fontsize=16)
plt.xlabel('Throttled Network Speed in Kbps', fontweight ='bold', fontsize = 12)
plt.ylabel('Interactive - Duration in seconds', fontweight ='bold', fontsize = 12)
plt.xticks([(r*tickwidth) for r in range(len(labels))], labels)

index=0
plot_values(plt,reportData["cpuSlowDownMultiplierResultsList"]["interactiveResult"],"cpu-interactive",0)
#plot_values(plt,reportData["cpuSlowDownMultiplierResultsList"]["speedIndex"],"cpu-speedindex",200)

plt.legend()
plt.show()

#save the plot
plt.savefig('lighthouse-'+applicationName+'-application.png', dpi=300, bbox_inches='tight')
