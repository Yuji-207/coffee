import 'package:flutter/material.dart';

class Beans extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final items = List<String>.generate(10, (i) => "Item $i");
    return Scaffold(
      appBar: AppBar(
        title: Text('coffee'),
      ),
      body: Container(
        width: double.infinity,
        child: ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text('${items[index]}'),
            );
          },
        ),
      ),
    );
  }
}
