# Adjust package information

github owner
business24ai

***

https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/
Make sure the package name starts with n8n-nodes- or @<scope>/n8n-nodes-.

n8n-nodes-b24-custom-nodes

***

Business24AI Custom Nodes for n8n

https://www.skool.com/business24ai

Kiu
q@b24.ai


check rimraf is installed
output is dist

important

```
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/ExampleCredentialsApi.credentials.js",
      "dist/credentials/HttpBinApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/ExampleNode/ExampleNode.node.js",
      "dist/nodes/HttpBin/HttpBin.node.js"
    ]
  },
```



