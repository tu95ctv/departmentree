function convertNode(node) {
    return {
        ...node,
        title: node.title,
        key: node.id,
    }
}
export function list_to_tree(list) {
    var map = {},
        node, roots = [],
        i;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent_id) {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node.parent_id]].children.push(convertNode(node));
        } else {
            roots.push(convertNode(node));
        }
    }
    return roots;
}

export function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}