from .models import Node

def create_node(validated_data):
    new_node = Node.objects.create(**validated_data)
    return new_node

def update_node(node:Node, validated_data):
    node.name= validated_data.get("name", node.name)
    node.data = validated_data.get("data", node.data)

    node.save()

    return node